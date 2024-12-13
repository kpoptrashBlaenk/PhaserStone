import OutlinePipelinePlugin from 'phaser3-rex-plugins/plugins/outlinepipeline-plugin'
import { EFFECT_ASSET_KEYS, UI_ASSET_KEYS } from '../assets/asset-keys'
import { BattleScene } from '../scenes/battle-scene'
import { BATTLE_STATES, TARGET_KEYS, TargetKeys, WARNING_KEYS } from '../utils/keys'
import { BoardCard } from './card/board-card'
import { ATTACK_CONFIGS, CARD_NUMBER_FONT_STYLE, DEATH_CONFIGS, HERO_CONFIGS } from '../utils/visual-configs'
import { MAX_HEALTH } from '../utils/configs'
import { DAMAGE_CONFIGS } from '../utils/visual-configs'
import { checkStats } from '../common/set-stats'
import { setOutline } from '../common/outline'

export class Hero {
  public alreadyAttacked: boolean
  public currentHealth: number
  public currentAttack: number
  private scene: BattleScene
  private owner: TargetKeys
  private heroContainer: Phaser.GameObjects.Container
  private heroImage: Phaser.GameObjects.Image
  private healthText: Phaser.GameObjects.Text
  private maxHealth: number
  private attackText: Phaser.GameObjects.Text
  private attackContainer: Phaser.GameObjects.Container
  private cancelImage: Phaser.GameObjects.Image | undefined

  constructor(scene: BattleScene, owner: TargetKeys) {
    this.scene = scene
    this.owner = owner

    this.maxHealth = MAX_HEALTH
    this.currentHealth = this.maxHealth
    this.currentAttack = 1
    this.alreadyAttacked = false

    this.createHero()
    if (this.owner === TARGET_KEYS.PLAYER) {
      this.forPlayer()
    } else {
      this.forOpponent()
    }
  }

  public get attackAmount(): number {
    return this.currentAttack
  }

  public get healthAmount(): number {
    return this.currentHealth
  }

  public set setAttackAmount(attack: number) {
    this.currentAttack = attack
    checkStats(this.currentAttack, 0, this.attackText)
  }

  public set setHealthAmount(health: number) {
    this.currentHealth = health
    checkStats(this.currentHealth, this.maxHealth, this.healthText)
  }

  public set setAlreadyAttacked(attacked: boolean) {
    this.alreadyAttacked = attacked
    if (attacked) {
      this.removeOutline()
    }
  }

  public get container(): Phaser.GameObjects.Container {
    return this.heroContainer
  }

  public get image(): Phaser.GameObjects.Image {
    return this.heroImage
  }

  /**
   * Get hero owner
   */
  public get player(): TargetKeys {
    return this.owner
  }

  /**
   * Get data (health only)
   */
  public get heroUI(): Phaser.GameObjects.Container {
    return this.heroContainer
  }

  /**
   * Check if didn't attack and add or remove border
   */
  public checkCanAttack(): void {
    const canAttack = this.currentAttack > 0 && !this.alreadyAttacked && this.owner === TARGET_KEYS.PLAYER
    setOutline(this.scene, canAttack, this.heroImage)

    if (this.currentAttack > 0) {
      this.attackContainer.setAlpha(1)
      return
    }

    this.attackContainer.setAlpha(0)
  }

  /**
   * Remove Outline
   */
  public removeOutline(): void {
    setOutline(this.scene, false, this.heroImage)
  }

  /**
   * Remove cancel image when selection cancelled or fulfilled
   */
  public removeCancel(): void {
    this.cancelImage?.setAlpha(0)
  }

  /**
   * Create hero container
   */
  private createHero(): void {
    // Portrait
    const portrait = this.scene.add.rectangle(
      0,
      0,
      HERO_CONFIGS.width,
      HERO_CONFIGS.height,
      HERO_CONFIGS.color
    )

    // Health
    const healthImage = this.scene.add.image(0, 0, UI_ASSET_KEYS.HEALTH).setOrigin(0)
    const healthText = this.scene.add
      .text(healthImage.width / 2, healthImage.height / 2, String(this.currentHealth), CARD_NUMBER_FONT_STYLE)
      .setScale(2.5)
      .setOrigin(0.5)
    const healthContainer = this.scene.add.container(0, 0, [healthImage, healthText]).setScale(0.25)
    healthContainer.setPosition((healthImage.width / 3) * healthContainer.scale)

    // Attack
    const attackImage = this.scene.add.image(0, 0, UI_ASSET_KEYS.HEALTH).setOrigin(0)
    const attackText = this.scene.add
      .text(attackImage.width / 2, attackImage.height / 2, String(this.currentAttack), CARD_NUMBER_FONT_STYLE)
      .setScale(2.5)
      .setOrigin(0.5)
    const attackContainer = this.scene.add.container(0, 0, [attackImage, attackText]).setScale(0.25)
    attackContainer
      .setPosition(
        -((attackImage.width * 4) / 3) * attackContainer.scale,
        (attackImage.width / 3) * attackContainer.scale
      )
      .setAlpha(0)

    // Container
    this.heroContainer = this.scene.add
      .container(this.scene.scale.width / 2, HERO_CONFIGS.y[this.owner], [
        portrait,
        healthContainer,
        attackContainer,
      ])
      .setSize(portrait.width, portrait.height)
      .setInteractive({
        cursor: 'pointer',
      })

    this.heroImage = healthImage // place hero image when it becomes an actual image
    this.healthText = healthText
    this.attackText = healthText
    this.attackContainer = attackContainer
  }

  /**
   * Enemy clickable for attack
   */
  private forPlayer(): void {
    // Add cancel image for cancelling selection
    this.cancelImage = this.scene.battleManager.addCancelImage(0, 0, 0.5)
    this.heroContainer.add(this.cancelImage)

    // Click
    this.heroContainer.on('pointerup', () => {
      // If player turn and attack > 0, then check if already attacked then choose this for battle
      if (this.scene.stateMachine.currentStateName === BATTLE_STATES.PLAYER_TURN && this.currentAttack > 0) {
        if (this.alreadyAttacked) {
          this.scene.warnMessage.showTurnMessage(WARNING_KEYS.ALREADY_ATTACKED)
          return
        }

        this.scene.stateMachine.setState(BATTLE_STATES.ATTACKER_MINION_CHOSEN, this)
        this.cancelImage?.setAlpha(1)
        return
      }

      // If attacker chosen state and this is selected, cancel
      if (this.scene.stateMachine.currentStateName === BATTLE_STATES.ATTACKER_MINION_CHOSEN) {
        this.scene.stateMachine.setState(BATTLE_STATES.PLAYER_TURN, this)
        this.removeCancel()
      }
    })
  }

  private forOpponent(): void {
    this.heroContainer.on('pointerup', () => {
      if (this.scene.stateMachine.currentStateName === BATTLE_STATES.ATTACKER_MINION_CHOSEN) {
        this.scene.stateMachine.setState(BATTLE_STATES.DEFENDER_MINION_CHOSEN, this)
      }
    })
  }
}
