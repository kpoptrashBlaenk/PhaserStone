import OutlinePipelinePlugin from 'phaser3-rex-plugins/plugins/outlinepipeline-plugin'
import { EFFECT_ASSET_KEYS, UI_ASSET_KEYS } from '../assets/asset-keys'
import { BattleScene } from '../scenes/battle-scene'
import { BATTLE_STATES, TARGET_KEYS, TargetKeys, WARNING_KEYS } from '../utils/keys'
import { BoardCard } from './card/board-card'
import {
  ATTACK_CONFIGS,
  CARD_NUMBER_FONT_STYLE,
  DEATH_CONFIGS,
  HERO_CONFIGS,
  OUTLINE_CONFIG,
} from '../utils/visual-configs'
import { MAX_HEALTH } from '../utils/configs'
import { DAMAGE_CONFIGS } from '../utils/visual-configs'
import { checkStats } from '../common/check-stats'

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
  private cardBorder: OutlinePipelinePlugin | undefined
  private cancelImage: Phaser.GameObjects.Image | undefined

  constructor(scene: BattleScene, owner: TargetKeys) {
    this.scene = scene
    this.owner = owner

    this.maxHealth = MAX_HEALTH
    this.currentHealth = this.maxHealth
    this.currentAttack = 0
    this.alreadyAttacked = false

    this.createHero()
    this.addClick()
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
    if (this.currentAttack > 0 && !this.alreadyAttacked && this.owner === TARGET_KEYS.PLAYER) {
      if (!this.cardBorder) {
        this.cardBorder = this.scene.plugins.get('rexOutlinePipeline') as OutlinePipelinePlugin
        this.cardBorder?.add(this.heroImage, OUTLINE_CONFIG)
      }

      this.attackContainer.setAlpha(1)
      return
    }

    this.removeBorder()

    if (this.currentAttack > 0) {
      this.attackContainer.setAlpha(1)
      return
    }

    this.attackContainer.setAlpha(0)
  }

  /**
   * Remove Border
   */
  public removeBorder(): void {
    if (this.cardBorder) {
      this.cardBorder.remove(this.heroImage, 'outline')
      this.cardBorder = undefined
    }
  }

  /**
   * Remove cancel image when selection cancelled or fulfilled
   */
  public removeCancel(): void {
    this.cancelImage?.setAlpha(0)
  }

  /**
   * Death Animation: Shrink and fade out
   */
  public death(callback?: () => void): void {
    this.heroImage.setTint(DEATH_CONFIGS.TINT)

    // Shrink
    this.scene.tweens.add({
      delay: DEATH_CONFIGS.DELAY,
      targets: this.heroContainer,
      scale: DEATH_CONFIGS.SCALE,
      alpha: DEATH_CONFIGS.ALPHA,
      duration: DEATH_CONFIGS.DURATION,
      ease: DEATH_CONFIGS.EASE,
      onComplete: () => {
        callback?.()
      },
    })
  }

  /**
   * Minion being attacking logic
   */
  public damageTaken(): void {
    this.animateDamageTaken()

    // Set stats and check changes
    this.setStats()
  }

  /**
   * Attacking Hero logic
   */
  public attack(opponent: BoardCard | Hero, callback?: () => void): void {
    const startX = this.heroContainer.x
    const startY = this.heroContainer.y
    this.heroContainer.setDepth(1)

    // Get target position based on opponent type
    const target = this.getAttackTargetPosition(opponent)

    // Attack animation
    this.animateAttack({ x: startX, y: startY }, target, () => {
      // Damage
      this.applyDamage(opponent)
      this.damageTaken()
      opponent.damageTaken()

      this.alreadyAttacked = true
      this.removeBorder()

      // Return to the original position
      this.animateReturnToPosition({ x: startX, y: startY }, () => {
        callback?.()
        this.heroContainer.setDepth(0)
      })
    })
  }

  /**
   * Get target position based on opponent type
   */
  private getAttackTargetPosition(opponent: BoardCard | Hero): { x: number; y: number } {
    const opponentBounds =
      opponent instanceof BoardCard ? opponent.cardUI.getBounds() : opponent.heroUI.getBounds()

    const targetX = opponentBounds.centerX
    const targetY = opponentBounds.centerY + this.heroContainer.height / 3

    return { x: targetX, y: targetY }
  }

  /**
   * Animates taking a step back and crashing into defending minion
   */
  private animateAttack(
    startPosition: { x: number; y: number },
    targetPosition: { x: number; y: number },
    callback?: () => void
  ): void {
    // Card takes a step back
    this.scene.tweens.add({
      targets: this.heroContainer,
      y: startPosition.y + ATTACK_CONFIGS.STEP_BACK.Y[this.owner],
      duration: ATTACK_CONFIGS.STEP_BACK.DURATION,
      ease: ATTACK_CONFIGS.STEP_BACK.EASE,
      onComplete: () => {
        // Attack enemy
        this.scene.tweens.add({
          targets: this.heroContainer,
          x: targetPosition.x,
          y: targetPosition.y,
          duration: ATTACK_CONFIGS.ATTACK.DURATION,
          ease: ATTACK_CONFIGS.ATTACK.EASE,
          onComplete: () => callback?.(),
        })
      },
    })
  }

  /**
   * Apply damage to the opponent and update health values
   */
  private applyDamage(opponent: BoardCard | Hero): void {
    const damageDealt = this.currentAttack

    if (opponent instanceof BoardCard) {
      opponent.cardData.health -= damageDealt
      const damageTaken = opponent.cardData.attack
      this.currentHealth -= damageTaken
      return
    }

    if (opponent instanceof Hero) {
      opponent.currentHealth -= damageDealt
    }
  }

  /**
   * Returns minion to original position
   */
  private animateReturnToPosition(position: { x: number; y: number }, callback?: () => void): void {
    this.scene.tweens.add({
      targets: this.heroContainer,
      x: position.x,
      y: position.y,
      duration: ATTACK_CONFIGS.RETURN.DURATION,
      ease: ATTACK_CONFIGS.RETURN.EASE,
      onComplete: () => {
        callback?.()
      },
    })
  }

  /**
   * Flash, Particles and Camera Shake when damage taken
   */
  private animateDamageTaken(): void {
    // Flash effect
    this.scene.tweens.add({
      targets: this.heroContainer,
      alpha: DAMAGE_CONFIGS.FLASH.ALPHA,
      duration: DAMAGE_CONFIGS.FLASH.DURATION,
      yoyo: DAMAGE_CONFIGS.FLASH.YOYO,
      repeat: DAMAGE_CONFIGS.FLASH.REPEAT,
    })

    // Particle effect
    this.scene.add.particles(
      this.heroContainer.getBounds().centerX,
      this.heroContainer.getBounds().centerY,
      EFFECT_ASSET_KEYS.SPARK,
      {
        scale: DAMAGE_CONFIGS.SPARK.SCALE,
        speed: DAMAGE_CONFIGS.SPARK.SPEED,
        lifespan: DAMAGE_CONFIGS.SPARK.LIFESPAN,
        gravityY: DAMAGE_CONFIGS.SPARK.GRAVITY_Y,
        duration: DAMAGE_CONFIGS.SPARK.DURATION,
      }
    )

    // Camera shake
    this.scene.cameras.main.shake(DAMAGE_CONFIGS.CAMERA.DURATION, DAMAGE_CONFIGS.CAMERA.INTENSITY)
  }

  /**
   * Sets stats then check for changes and apply colors
   */
  private setStats(): void {
    checkStats(this.currentAttack, 0, this.attackText)
    checkStats(this.currentHealth, this.maxHealth, this.healthText)
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
    this.attack
  }

  /**
   * Enemy clickable for attack
   */
  private addClick(): void {
    if (this.owner === TARGET_KEYS.OPPONENT) {
      this.heroContainer.on('pointerup', () => {
        if (this.scene.stateMachine.currentStateName === BATTLE_STATES.ATTACKER_MINION_CHOSEN) {
          this.scene.stateMachine.setState(BATTLE_STATES.DEFENDER_MINION_CHOSEN, this)
        }
      })

      return
    }

    if (this.owner === TARGET_KEYS.PLAYER) {
      // Add cancel image for cancelling selection
      this.cancelImage = this.scene.add.image(0, 0, UI_ASSET_KEYS.CANCEL).setScale(0.5).setAlpha(0)
      this.heroContainer.add(this.cancelImage)

      // Click
      this.heroContainer.on('pointerup', () => {
        // If player turn and attack > 0, then check if already attacked then choose this for battle
        if (
          this.scene.stateMachine.currentStateName === BATTLE_STATES.PLAYER_TURN &&
          this.currentAttack > 0
        ) {
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
  }
}
