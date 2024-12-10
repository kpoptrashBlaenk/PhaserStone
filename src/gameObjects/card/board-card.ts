import { BATTLE_STATES, TARGET_KEYS, TargetKeys } from '../../utils/keys'
import { CardData } from './card-keys'
import { Card } from './card'
import { BattleScene } from '../../scenes/battle-scene'
import { EFFECT_ASSET_KEYS } from '../../assets/asset-keys'
import { HAND_CARD_SIZE, OUTLINE_CONFIG } from './hand-card'
import OutlinePipelinePlugin from 'phaser3-rex-plugins/plugins/outlinepipeline-plugin'

const ZZZ_ANIMATION_POSITION = Object.freeze({
  x: 220,
  y: 90,
})

export class BoardCard extends Card {
  private owner: TargetKeys
  private summoningSick: boolean
  private alreadyAttacked: boolean
  private summoningSickParticles: Phaser.GameObjects.Particles.ParticleEmitter | null = null
  private cardBorder: OutlinePipelinePlugin | undefined

  constructor(scene: BattleScene, card: CardData, owner: TargetKeys) {
    super(scene, card)
    this.owner = owner

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
   * Check if not summoning sick and didn't attack and add or remove border
   */
  public checkCanAttack(): void {
    if (!this.summoningSick && !this.alreadyAttacked) {
      if (!this.cardBorder) {
        this.cardBorder = this.scene.plugins.get('rexOutlinePipeline') as OutlinePipelinePlugin
        this.cardBorder?.add(this.cardImage, OUTLINE_CONFIG)
      }
    } else {
      this.removeBorder()
    }
  }

  /**
   * Remove Border
   */
  public removeBorder(): void {
    if (this.cardBorder) {
      this.cardBorder.remove(this.cardImage, 'outline')
      this.cardBorder = undefined
    }
  }

  /**
   * Attacking Minion logic
   */
  public attack(opponent: BoardCard, callback?: () => void): void {
    const startX = this.cardUI.x
    const startY = this.cardUI.y

    // Calculate difference between enemy card position and player card position to translate the position correctly
    const targetX = opponent.cardUI.getBounds().centerX - this.cardUI.getBounds().centerX + this.cardUI.x
    const targetY =
      opponent.cardUI.getBounds().centerY - this.cardUI.getBounds().centerY + this.cardUI.height / 3

    this.cardUI.setDepth(1)

    this.animateAttack({ x: startX, y: startY }, { x: targetX, y: targetY }, () => {
      const damageDealt = this.card.attack
      opponent.card.health -= damageDealt

      const damageTaken = opponent.card.attack
      this.card.health -= damageTaken

      this.damageTaken()
      opponent.damageTaken()

      this.alreadyAttacked = true
      this.removeBorder()

      // Return to position
      this.animateReturnToPosition({ x: startX, y: startY }, () => {
        callback?.()
        this.cardUI.setDepth(0)
      })
    })
  }

  /**
   * Death Animation: Shrink and fade out
   */
  public death(callback?: () => void): void {
    this.cardImage.setTint(0xff0000)

    // x and y to shrink towards the center
    this.scene.tweens.add({
      delay: 200,
      targets: this.cardUI,
      scale: 0,
      alpha: 0,
      x: this.cardUI.width / 2 + this.cardUI.x,
      y: this.cardUI.height / 2 + this.cardUI.y,
      duration: 500,
      ease: 'Cubic.easeOut',
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
      y: startPosition.y + (this.owner === TARGET_KEYS.PLAYER ? 10 : -10),
      duration: 150,
      ease: 'Sine.easeOut',
      onComplete: () => {
        // Attack enemy
        this.scene.tweens.add({
          targets: this.cardUI,
          x: targetPosition.x,
          y: targetPosition.y,
          duration: 200,
          ease: 'Quad.easeOut',
          onComplete: () => callback?.(),
        })
      },
    })
  }

  /**
   * Minion being attacking logic
   */
  private damageTaken() {
    this.animateDamageTaken()

    // Set stats and check changes
    this.setStats()
  }

  /**
   * Flash, Particles and Camera Shake when damage taken
   */
  private animateDamageTaken(): void {
    // Flash effect
    this.scene.tweens.add({
      targets: this.cardUI,
      alpha: 0,
      duration: 50,
      yoyo: true,
      repeat: 2,
    })

    // Particle effect
    this.scene.add.particles(
      this.cardUI.getBounds().centerX,
      this.cardUI.getBounds().centerY,
      EFFECT_ASSET_KEYS.SPARK,
      {
        scale: 0.075,
        speed: 100,
        lifespan: 500,
        gravityY: 100,
        duration: 50,
      }
    )

    // Camera shake
    this.scene.cameras.main.shake(100, 0.01)
  }

  /**
   * Returns minion to original position
   */
  private animateReturnToPosition(position: { x: number; y: number }, callback?: () => void): void {
    this.scene.tweens.add({
      targets: this.cardUI,
      x: position.x,
      y: position.y,
      duration: 200,
      ease: 'Quad.easeIn',
      onComplete: () => {
        callback?.()
      },
    })
  }

  /**
   * Add Click
   */
  private forPlayer(): void {
    this.cardImage.on('pointerup', () => {
      if (this.scene.stateMachine.currentStateName === BATTLE_STATES.PLAYER_TURN) {
        this.scene.stateMachine.setState(BATTLE_STATES.ATTACKER_MINION_CHOSEN, this)
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
    this.cardContainer.setScale(HAND_CARD_SIZE.scale)
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
          scale: { start: 0.2, end: 0 },
          speed: 50,
          lifespan: 2000,
          frequency: 1000,
          angle: { min: -90, max: -90 },
          gravityY: 10,
          accelerationX: 50,
          accelerationY: -50,
        }
      )

      this.cardUI.add(this.summoningSickParticles)
      return
    }

    this.summoningSickParticles?.destroy()
    this.summoningSickParticles = null
  }
}
