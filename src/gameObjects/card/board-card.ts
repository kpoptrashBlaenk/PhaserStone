import { BATTLE_STATES, TARGET_KEYS, TargetKeys } from '../../utils/keys'
import { CardData } from './card-keys'
import { Card } from './card'
import { BattleScene } from '../../scenes/battle-scene'
import { EFFECT_ASSET_KEYS } from '../../assets/asset-keys'

export class BoardCard extends Card {
  private owner: TargetKeys

  constructor(scene: BattleScene, card: CardData, owner: TargetKeys) {
    super(scene, card)
    this.owner = owner

    this.boardSize()
    this.cardImage.setInteractive()
    this.addHover()

    if (this.owner === TARGET_KEYS.PLAYER) {
      this.forPlayer()
    } else {
      this.forOpponent()
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

    // Card takes a step back
    this.scene.tweens.add({
      targets: this.cardUI,
      y: startY + 10,
      duration: 150,
      ease: 'Sine.easeOut',
      onComplete: () => {
        // Attack enemy
        this.scene.tweens.add({
          targets: this.cardUI,
          x: targetX,
          y: targetY,
          duration: 200,
          ease: 'Quad.easeOut',
          onComplete: () => {
            const damageDealt = this.card.attack
            opponent.card.health -= damageDealt

            const damageTaken = opponent.card.attack
            this.card.health -= damageTaken

            this.attacked()
            opponent.attacked()

            // Return to position
            this.scene.tweens.add({
              targets: this.cardUI,
              x: startX,
              y: startY,
              duration: 200,
              ease: 'Quad.easeIn',
              onComplete: () => {
                callback?.()
                this.cardUI.setDepth(0)
              },
            })
          },
        })
      },
    })
  }

  /**
   * Minion being attacking logic
   */
  public attacked() {
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

    // Set stats and check changes
    this.setStats()
  }

  /**
   * Death Animation: Shrink and fade out
   */
  public death(): void {
    this.scene.tweens.add({
      delay: 200,
      targets: this.cardUI,
      scale: 0,
      alpha: 0,
      duration: 500,
      ease: 'Cubic.easeOut',
    })

    // this.cardUI.setTint(0xff0000)
  }

  /**
   * Add Click
   */
  private forPlayer(): void {
    this.cardImage.on('pointerup', () => {
      if (this.scene.stateMachine.currentStateName === BATTLE_STATES.PLAYER_TURN) {
        this.scene.stateMachine.setState(BATTLE_STATES.PLAYER_MINION_CHOSEN, this)
      }
    })
  }

  /**
   * Add Click
   */
  private forOpponent(): void {
    this.cardImage.on('pointerup', () => {
      if (this.scene.stateMachine.currentStateName === BATTLE_STATES.PLAYER_MINION_CHOSEN) {
        this.scene.stateMachine.setState(BATTLE_STATES.OPPONENT_MINION_CHOSEN, this)
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
    this.cardContainer.setScale(0.36)
    this.cardContainer.setSize(
      this.cardContainer.width * this.cardContainer.scaleX,
      this.cardContainer.height * this.cardContainer.scaleY
    )
  }
}
