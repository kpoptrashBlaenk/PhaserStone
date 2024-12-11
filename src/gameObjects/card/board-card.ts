import { BATTLE_STATES, TARGET_KEYS, TargetKeys, WARNING_KEYS } from '../../utils/keys'
import { CardData } from './card-keys'
import { Card } from './card'
import { BattleScene } from '../../scenes/battle-scene'
import { EFFECT_ASSET_KEYS, UI_ASSET_KEYS } from '../../assets/asset-keys'
import { Hero } from '../hero'
import {
  ATTACK_CONFIGS,
  CARD_SCALE,
  DAMAGE_CONFIGS,
  DEATH_CONFIGS,
  SUMMONING_SICK_CONFIGS,
  ZZZ_ANIMATION_POSITION,
} from '../../utils/visual-configs'
import { setOutline } from '../../common/outline'

export class BoardCard extends Card {
  private alreadyAttacked: boolean
  private summoningSick: boolean
  private summoningSickParticles: Phaser.GameObjects.Particles.ParticleEmitter | null = null
  private cancelImage: Phaser.GameObjects.Image | undefined

  constructor(scene: BattleScene, card: CardData, owner: TargetKeys) {
    super(scene, card, owner)

    this.boardSize()

    this.cardImage.setInteractive({
      cursor: 'pointer',
    })
    this.addHover()

    if (this.owner === TARGET_KEYS.PLAYER) {
      this.forPlayer()
    } else {
      this.forOpponent()
    }

    this.setSummoningSick = true
    this.setAlreadyAttacked = false
  }

  /**
   * Get card owner
   */
  public get player(): TargetKeys {
    return this.owner
  }

  /**
   * Get if minion has is summoning sick
   */
  public get isSummoningSick(): boolean {
    return this.summoningSick
  }

  /**
   * Get if minion already attacked
   */
  public get isAlreadyAttacked(): boolean {
    return this.alreadyAttacked
  }

  /**
   * Sets if minion has is summoning sick
   */
  public set setSummoningSick(value: boolean) {
    this.summoningSick = value
    this.summoningSickAnimation()
  }

  /**
   * Sets if minion already attacked
   */
  public set setAlreadyAttacked(value: boolean) {
    this.alreadyAttacked = value
  }

  /**
   * Remove cancel image when selection cancelled or fulfilled
   */
  public removeCancel(): void {
    this.cancelImage?.setAlpha(0)
  }

  /**
   * Check if not summoning sick and didn't attack and add or remove border
   */
  public checkCanAttack(): void {
    const canAttack = !this.summoningSick && !this.alreadyAttacked
    setOutline(this.scene, canAttack, this.cardImage)
  }

  /**
   * Remove Outline
   */
  public removeOutline(): void {
    setOutline(this.scene, false, this.cardImage)
  }

  /**
   * Attacking Minion logic
   */
  public attack(opponent: BoardCard | Hero, callback?: () => void): void {
    const startX = this.cardUI.x
    const startY = this.cardUI.y
    this.cardUI.setDepth(1)

    // Get target position based on opponent type
    const target = this.getAttackTargetPosition(opponent)

    // Attack animation
    this.animateAttack({ x: startX, y: startY }, target, () => {
      // Damage
      this.applyDamage(opponent)
      this.damageTaken()
      opponent.damageTaken()

      this.alreadyAttacked = true
      this.removeOutline()

      // Return to the original position
      this.animateReturnToPosition({ x: startX, y: startY }, () => {
        callback?.()
        this.cardUI.setDepth(0)
      })
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
   * Get target position based on opponent type
   */
  private getAttackTargetPosition(opponent: BoardCard | Hero): { x: number; y: number } {
    const opponentBounds =
      opponent instanceof BoardCard ? opponent.cardUI.getBounds() : opponent.heroUI.getBounds()
    const cardBounds = this.cardUI.getBounds()

    const targetX = opponentBounds.centerX - cardBounds.centerX + this.cardUI.x
    const targetY = opponentBounds.centerY - cardBounds.centerY + this.cardUI.height / 3

    return { x: targetX, y: targetY }
  }

  /**
   * Apply damage to the opponent and update health values
   */
  private applyDamage(opponent: BoardCard | Hero): void {
    const damageDealt = this.card.attack

    if (opponent instanceof BoardCard) {
      opponent.card.health -= damageDealt
      const damageTaken = opponent.card.attack
      this.card.health -= damageTaken
      return
    }

    if (opponent instanceof Hero) {
      opponent.currentHealth -= damageDealt
    }
  }

  /**
   * Death Animation: Shrink and fade out
   */
  public death(callback?: () => void): void {
    this.cardImage.setTint(0xff0000)

    // x and y to shrink towards the center
    this.scene.tweens.add({
      delay: DEATH_CONFIGS.DELAY,
      targets: this.cardUI,
      scale: DEATH_CONFIGS.SCALE,
      alpha: DEATH_CONFIGS.ALPHA,
      x: this.cardUI.width / 2 + this.cardUI.x,
      y: this.cardUI.height / 2 + this.cardUI.y,
      duration: DEATH_CONFIGS.DURATION,
      ease: DEATH_CONFIGS.EASE,
      onComplete: () => {
        callback?.()
      },
    })
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
      targets: this.cardUI,
      y: startPosition.y + ATTACK_CONFIGS.STEP_BACK.Y[this.owner],
      duration: ATTACK_CONFIGS.STEP_BACK.DURATION,
      ease: ATTACK_CONFIGS.STEP_BACK.EASE,
      onComplete: () => {
        // Attack enemy
        this.scene.tweens.add({
          targets: this.cardUI,
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
   * Flash, Particles and Camera Shake when damage taken
   */
  private animateDamageTaken(): void {
    // Flash effect
    this.scene.tweens.add({
      targets: this.cardUI,
      alpha: DAMAGE_CONFIGS.FLASH.ALPHA,
      duration: DAMAGE_CONFIGS.FLASH.DURATION,
      yoyo: DAMAGE_CONFIGS.FLASH.YOYO,
      repeat: DAMAGE_CONFIGS.FLASH.REPEAT,
    })

    // Particle effect
    this.scene.add.particles(
      this.cardUI.getBounds().centerX,
      this.cardUI.getBounds().centerY,
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
   * Returns minion to original position
   */
  private animateReturnToPosition(position: { x: number; y: number }, callback?: () => void): void {
    this.scene.tweens.add({
      targets: this.cardUI,
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
   * Add Click
   */
  private forPlayer(): void {
    // Add cancel image for cancelling selection
    this.cancelImage = this.scene.add
      .image(
        this.cardUI.width / 2 / this.cardUI.scale,
        this.cardUI.height / 2 / this.cardUI.scale,
        UI_ASSET_KEYS.CANCEL
      )
      .setScale(0.8)
      .setAlpha(0)
    this.cardUI.add(this.cancelImage)

    this.cardImage.on('pointerup', () => {
      // If player turn, check if not sick and not attacked, choose this to attack
      if (this.scene.stateMachine.currentStateName === BATTLE_STATES.PLAYER_TURN) {
        if (this.summoningSick) {
          this.scene.warnMessage.showTurnMessage(WARNING_KEYS.SUMMONING_SICK)
          return
        }
        if (this.alreadyAttacked) {
          this.scene.warnMessage.showTurnMessage(WARNING_KEYS.ALREADY_ATTACKED)
          return
        }

        this.scene.stateMachine.setState(BATTLE_STATES.ATTACKER_MINION_CHOSEN, this)
        this.cancelImage?.setAlpha(1)
        return
      }

      // If choose enemy and this selected, cancel
      if (this.scene.stateMachine.currentStateName === BATTLE_STATES.ATTACKER_MINION_CHOSEN) {
        this.scene.stateMachine.setState(BATTLE_STATES.PLAYER_TURN, this)
        this.removeCancel()
      }
    })
  }

  /**
   * Add Click
   */
  private forOpponent(): void {
    this.cardImage.on('pointerup', () => {
      if (this.scene.stateMachine.currentStateName === BATTLE_STATES.ATTACKER_MINION_CHOSEN) {
        this.scene.stateMachine.setState(BATTLE_STATES.DEFENDER_MINION_CHOSEN, this)
      }
    })
  }

  /**
   * Add PreviewUI to hover and hide it on unhover
   */
  private addHover(): void {
    this.cardImage.on('pointerover', () => {
      this.scene.playerPreview.modifyPreviewCardObjects(this.card, this.originalCard)
    })

    this.cardImage.on('pointerout', () => {
      this.scene.playerPreview.hideCard()
    })
  }

  /**
   * Resize Card to fit in hand
   */
  private boardSize(): void {
    this.cardContainer.setScale(CARD_SCALE)
    this.cardContainer.setSize(
      this.cardContainer.width * this.cardContainer.scaleX,
      this.cardContainer.height * this.cardContainer.scaleY
    )
  }

  /**
   * Play or destroy zzz animation depending on summoningSick
   */
  private summoningSickAnimation(): void {
    if (this.summoningSick) {
      this.summoningSickParticles = this.scene.add.particles(
        ZZZ_ANIMATION_POSITION.x,
        ZZZ_ANIMATION_POSITION.y,
        EFFECT_ASSET_KEYS.Z,
        {
          scale: { start: SUMMONING_SICK_CONFIGS.SCALE.START, end: SUMMONING_SICK_CONFIGS.SCALE.END },
          speed: SUMMONING_SICK_CONFIGS.SPEED,
          lifespan: SUMMONING_SICK_CONFIGS.LIFESPAN,
          frequency: SUMMONING_SICK_CONFIGS.FREQUENCY,
          angle: { min: SUMMONING_SICK_CONFIGS.ANGLE.MIN, max: SUMMONING_SICK_CONFIGS.ANGLE.MAX },
          gravityY: SUMMONING_SICK_CONFIGS.GRAVITY_Y,
          accelerationX: SUMMONING_SICK_CONFIGS.ACCELERATION_X,
          accelerationY: SUMMONING_SICK_CONFIGS.ACCELERATION_Y,
        }
      )

      this.cardUI.add(this.summoningSickParticles)
      return
    }

    this.summoningSickParticles?.destroy()
    this.summoningSickParticles = null
  }
}
