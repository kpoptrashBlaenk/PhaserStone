import { BattleScene } from '../scenes/battle-scene'
import { TARGET_KEYS, TargetKeys } from '../utils/keys'
import { resizeContainer } from '../utils/resize-container'
import { BOARD_POSITION_Y } from './board'
import { HAND_CARD_SIZE, HandCard } from './card/hand-card'

export class Hand {
  private scene: BattleScene
  private owner: TargetKeys
  private handContainer: Phaser.GameObjects.Container
  private hand: HandCard[]

  constructor(scene: BattleScene, owner: TargetKeys) {
    this.scene = scene
    this.owner = owner

    this.hand = []
    // Always above board cards
    this.handContainer = this.createHandContainer().setDepth(1)
    this.resizeHandContainer()
  }

  /**
   * Return all hand cards
   */
  public get handCards(): HandCard[] {
    return this.hand
  }

  /**
   * Get original position of card on deck -> add to handContainer then resize container and get new position -> set to old position and animate movement to new position
   */
  public drawCard(card: HandCard, callback: () => void): void {
    this.hand.push(card)

    // Get original global position of card
    const originalPositionX = card.cardUI.getBounds().x
    const originalPositionY = card.cardUI.getBounds().y

    this.handContainer.add(card.cardUI)
    this.resizeHandContainer()

    const newPositionX = card.cardUI.x
    const newPositionY = card.cardUI.y

    card.cardUI.setPosition(
      originalPositionX - this.handContainer.x,
      originalPositionY - this.handContainer.y
    )

    // Moving to Hand Animation
    this.scene.tweens.add({
      targets: card.cardUI,
      x: newPositionX,
      y: newPositionY,
      duration: 500,
      ease: 'Sine.easeOut',
      onComplete: () => {
        callback()
      },
    })
  }

  /**
   * Remove Card from hand and handContainer -> Resize
   */
  public playCard(card: HandCard, callback: () => void): void {
    // Prepare remove card from hand function
    const removeFromHand = () => {
      const index = this.hand.findIndex((handCard) => handCard === card)
      this.hand.splice(index, 1)
      this.handContainer.remove(card.cardUI, true)
      this.resizeHandContainer()
      callback?.()
    }

    // If player, execute function, if not, play PlayCardAnimation and then execute function
    if (this.owner === TARGET_KEYS.PLAYER) {
      removeFromHand()
    } else {
      this.scene.tweens.add({
        targets: card.cardUI,
        x: this.scene.scale.width / 2 - card.cardUI.getBounds().centerX + card.cardUI.x,
        y: BOARD_POSITION_Y.OPPONENT - card.cardUI.getBounds().y + card.cardUI.y,
        duration: 500,
        ease: 'Sine.easeOut',
        onComplete: () => {
          removeFromHand()
        },
      })
    }
  }

  /**
   * Resize handContainer and reposition it
   */
  private resizeHandContainer(): void {
    resizeContainer(this.handContainer, () => {
      this.setPosition()
    })
  }

  /**
   * Set Position of handContainer, Math.max to ensure default placement of empty hand
   */
  private setPosition(): void {
    if (this.owner === TARGET_KEYS.PLAYER) {
      this.handContainer.setPosition(
        this.scene.scale.width / 2 - Math.max(this.handContainer.width, HAND_CARD_SIZE.width) / 2,
        this.scene.scale.height - Math.max(this.handContainer.height, HAND_CARD_SIZE.height)
      )
    } else {
      this.handContainer.setPosition(
        this.scene.scale.width / 2 - Math.max(this.handContainer.width, HAND_CARD_SIZE.width) / 2,
        0
      )
    }
  }

  /**
   * Create handContainer
   */
  private createHandContainer(): Phaser.GameObjects.Container {
    return this.scene.add.container()
  }
}
