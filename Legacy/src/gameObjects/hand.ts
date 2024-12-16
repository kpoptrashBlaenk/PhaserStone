import { BattleScene } from '../scenes/battle-scene'
import { TARGET_KEYS, TargetKeys } from '../../../src/utils/keys'
import { repositionContainer, resizeContainer } from '../common/resize-container'
import { BOARD_POSITION_Y, HAND_CARD_SIZE, HAND_CONFIGS } from '../utils/visual-configs'
import { HandCard } from './card/hand-card'

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
  public drawCard(card: HandCard | undefined, callback?: () => void): void {
    if (!card) {
      callback?.()
      return
    }

    this.hand.push(card)

    // Get original global position of card
    const originalPositionX = card.container.getBounds().x
    const originalPositionY = card.container.getBounds().y

    this.handContainer.add(card.container)

    // Place card to the right of container then resize
    const newPositionX = this.handContainer.width
    const newPositionY = 0

    card.container.setPosition(
      originalPositionX - this.handContainer.x,
      originalPositionY - this.handContainer.y
    )

    // Moving to Hand Animation
    this.scene.tweens.add({
      targets: card.container,
      x: newPositionX,
      y: newPositionY,
      duration: HAND_CONFIGS.DECK_TO_HAND.DURATION,
      ease: HAND_CONFIGS.DECK_TO_HAND.EASE,
      onComplete: () => {
        this.resizeHandContainer()
        callback?.()
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
      callback?.()
      this.handContainer.remove(card.container, true)
      this.resizeHandContainer()
    }

    // If player, execute function, if not, play PlayCardAnimation and then execute function
    if (this.owner === TARGET_KEYS.PLAYER) {
      removeFromHand()
    } else {
      this.animateCardFromHandToBoard(card, removeFromHand)
    }
  }

  /**
   * Animates opponent playing card from hand
   */
  private animateCardFromHandToBoard(card: HandCard, callback?: () => void): void {
    this.scene.tweens.add({
      targets: card.container,
      x: this.scene.scale.width / 2 - card.container.getBounds().x + card.container.x,
      y: BOARD_POSITION_Y.OPPONENT - card.container.getBounds().y + card.container.y,
      duration: HAND_CONFIGS.HAND_TO_BOARD.DURATION,
      ease: HAND_CONFIGS.HAND_TO_BOARD.EASE,
      onComplete: () => {
        callback?.()
      },
    })
  }

  /**
   * Resize handContainer and reposition it
   */
  private resizeHandContainer(): void {
    resizeContainer(this.handContainer, () => {
      const x = this.scene.scale.width / 2 - Math.max(this.handContainer.width, HAND_CARD_SIZE.width) / 2
      let y

      this.owner === TARGET_KEYS.PLAYER
        ? (y = this.scene.scale.height - Math.max(this.handContainer.height, HAND_CARD_SIZE.height))
        : (y = 0)

      repositionContainer(this.handContainer, x, y)
    })
  }

  /**
   * Create handContainer
   */
  private createHandContainer(): Phaser.GameObjects.Container {
    return this.scene.add.container()
  }
}
