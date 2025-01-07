import { UI_ASSET_KEYS } from '../assets/asset-keys'
import { setOutline } from '../common/outline'
import { colorStat } from '../common/stats-change'
import { MAX_HEALTH } from '../utils/configs'
import { STATES, TARGET_KEYS, TargetKeys } from '../utils/keys'
import { StateMachine } from '../utils/state-machine'
import { CARD_CONFIG, HERO_CONFIG } from '../utils/visual-configs'

export class Hero {
  private $scene: Phaser.Scene
  private $owner: TargetKeys
  private $maxHealth: number
  private $currentHealth: number
  private $currentAttack: number
  private $attacked: boolean
  private $heroImage: Phaser.GameObjects.Image
  private $healthText: Phaser.GameObjects.Text
  private $attackText: Phaser.GameObjects.Text
  private $attackContainer: Phaser.GameObjects.Container
  private $heroContainer: Phaser.GameObjects.Container
  private $cancelButton: Phaser.GameObjects.Image
  private $stateMachine: StateMachine

  constructor(scene: Phaser.Scene, stateMachine: StateMachine, owner: TargetKeys) {
    this.$scene = scene
    this.$stateMachine = stateMachine
    this.$owner = owner
    this.$currentAttack = 0
    this.$maxHealth = MAX_HEALTH
    this.$currentHealth = this.$maxHealth
    this.$attacked = false

    this.$createHero()
    this.setAttack(0)

    this.$addClick()
  }

  public get player(): TargetKeys {
    return this.$owner
  }

  public get container(): Phaser.GameObjects.Container {
    return this.$heroContainer
  }

  public get health(): number {
    return this.$currentHealth
  }

  public get maxHealth(): number {
    return this.$maxHealth
  }

  public get attack(): number {
    return this.$currentAttack
  }

  public get canAttack(): boolean {
    return !this.$attacked && this.$currentAttack > 0
  }

  public setHealth(newHealth: number): void {
    this.$currentHealth = newHealth > this.$maxHealth ? this.$maxHealth : newHealth

    colorStat(this.$currentHealth, this.$maxHealth, this.$healthText)
  }

  public setAttack(newAttack: number): void {
    this.$currentAttack = newAttack
    this.$attackContainer.setAlpha(this.$currentAttack > 0 ? 1 : 0)

    colorStat(this.$currentAttack, 0, this.$attackText)
  }

  public setAttacked(attacked: boolean) {
    this.$attacked = attacked
    this.setOutline(!this.$attacked)
  }

  public setOutline(value: boolean): void {
    if (this.$owner === TARGET_KEYS.PLAYER) {
      setOutline(this.$scene, value, this.$heroImage)
    }
  }

  public setTarget(targeted: boolean): void {
    if (targeted) {
      this.$heroImage.setTint(0xff0000)
    } else {
      this.$heroImage.setTint(0xffffff)
    }
  }

  private $createHero(): void {
    const portrait = this.$scene.add.rectangle(0, 0, HERO_CONFIG.WIDTH, HERO_CONFIG.HEIGHT, HERO_CONFIG.COLOR)

    // Health
    const healthImage = this.$scene.add.image(0, 0, UI_ASSET_KEYS.HEALTH).setOrigin(0)
    const healthText = this.$scene.add
      .text(
        healthImage.width / 2,
        healthImage.height / 2,
        String(this.$currentHealth),
        CARD_CONFIG.FONT_STYLE.NUMBER
      )
      .setScale(2.5)
      .setOrigin(0.5)
    const healthContainer = this.$scene.add.container(0, 0, [healthImage, healthText]).setScale(0.25)
    healthContainer.setPosition((healthImage.width / 3) * healthContainer.scale)

    // Attack
    const attackImage = this.$scene.add.image(0, 0, UI_ASSET_KEYS.HEALTH).setOrigin(0)
    const attackText = this.$scene.add
      .text(
        attackImage.width / 2,
        attackImage.height / 2,
        String(this.$currentAttack),
        CARD_CONFIG.FONT_STYLE.NUMBER
      )
      .setScale(2.5)
      .setOrigin(0.5)
    const attackContainer = this.$scene.add.container(0, 0, [attackImage, attackText]).setScale(0.25)
    attackContainer.setPosition(
      -((attackImage.width * 4) / 3) * attackContainer.scale,
      (attackImage.width / 3) * attackContainer.scale
    )

    // Container
    this.$heroContainer = this.$scene.add
      .container(this.$scene.scale.width / 2, HERO_CONFIG.Y[this.$owner], [
        portrait,
        healthContainer,
        attackContainer,
      ])
      .setSize(portrait.width, portrait.height)
      .setInteractive({
        cursor: 'pointer',
      })

    this.$heroImage = healthImage // place hero image when it becomes an actual image
    this.$healthText = healthText
    this.$attackText = attackText
    this.$attackContainer = attackContainer
  }

  private $addClick(): void {
    this.$heroContainer.on('pointerup', () => {
      // Battlecry
      if (this.$stateMachine.currentStateName === STATES.PLAYER_BATTLECRY_CHOOSE_TARGET) {
        this.$stateMachine.setState(STATES.PLAYER_BATTLECRY_TARGET_CHOSEN, this)
        return
      }

      // Player
      if (this.$owner === TARGET_KEYS.PLAYER) {
        if (this.$stateMachine.currentStateName === STATES.PLAYER_TURN && this.$currentAttack > 0) {
          if (this.$attacked) {
            // warn, already attacked
            return
          }

          this.$addCancel()
          this.$stateMachine.setState(STATES.PLAYER_BATTLE_CHOOSE_TARGET, {
            attacker: this,
            cancelButton: this.$cancelButton,
          })
          return
        }

        if (this.$stateMachine.currentStateName === STATES.PLAYER_BATTLE_CHOOSE_TARGET) {
          this.$stateMachine.setState(STATES.PLAYER_TURN, this)
          this.$removeCancel()
        }

        return
      }

      // Enemy
      if (this.$owner === TARGET_KEYS.ENEMY) {
        if (this.$stateMachine.currentStateName === STATES.PLAYER_BATTLE_CHOOSE_TARGET) {
          this.$stateMachine.setState(STATES.PLAYER_BATTLE_TARGET_CHOSEN, this)
        }
      }
    })
  }

  private $addCancel(): void {
    this.$cancelButton = this.$scene.add
      .image(this.$heroContainer.width / 2, this.$heroContainer.height / 2, UI_ASSET_KEYS.CANCEL)
      .setScale(0.3)
      .setAlpha(1)
      .setOrigin(1)

    this.$heroContainer.add(this.$cancelButton)
  }

  private $removeCancel(): void {
    if (this.$cancelButton) {
      this.$cancelButton.destroy()
    }
  }
}
