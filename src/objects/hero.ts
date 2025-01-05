import { UI_ASSET_KEYS } from '../assets/asset-keys'
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
    this.$maxHealth = MAX_HEALTH
    this.$currentHealth = this.$maxHealth
    this.$currentAttack = 1
    this.$attacked = false

    this.$createHealth()

    if (this.$owner === TARGET_KEYS.PLAYER) {
      this.$addClickPlayer()
    } else {
      this.$addClickEnemy()
    }
  }

  private $createHealth(): void {
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
    attackContainer
      .setPosition(
        -((attackImage.width * 4) / 3) * attackContainer.scale,
        (attackImage.width / 3) * attackContainer.scale
      )
      .setAlpha(0)

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
    this.$attackText = healthText
    this.$attackContainer = attackContainer
  }

  private $addClickPlayer(): void {
    this.$heroContainer.on('pointerup', () => {
      if (this.$stateMachine.currentStateName === STATES.PLAYER_TURN && this.$currentAttack > 0) {
        if (this.$attacked) {
          // warn, already attacked
          return
        }

        this.$stateMachine.setState(STATES.PLAYER_BATTLE_CHOOSE_TARGET, this)
        this.$addCancel()
        return
      }

      if (this.$stateMachine.currentStateName === STATES.PLAYER_BATTLE_CHOOSE_TARGET) {
        this.$stateMachine.setState(STATES.PLAYER_TURN, this)
        this.$removeCancel()
      }
    })
  }

  private $addClickEnemy(): void {
    this.$heroContainer.on('pointerup', () => {
      if (this.$stateMachine.currentStateName === STATES.PLAYER_BATTLE_CHOOSE_TARGET) {
        this.$stateMachine.setState(STATES.PLAYER_BATTLE_TARGET_CHOSEN, this)
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
