import { repositionContainer, resizeContainer } from '../common/resize-container'
import { AnimationManager } from '../utils/animation-manager'
import { TARGET_KEYS, TargetKeys } from '../utils/keys'
import { CARD_CONFIG } from '../utils/visual-configs'
import { Card } from './card'

export class Hand {
  private $scene: Phaser.Scene
  private $owner: TargetKeys
  private $animationManager: AnimationManager
  private $hand: Card[]
  private $handContainer: Phaser.GameObjects.Container

  constructor(scene: Phaser.Scene, owner: TargetKeys, animationManager: AnimationManager) {
    this.$scene = scene
    this.$owner = owner
    this.$animationManager = animationManager
    this.$hand = []

    this.$createContainer()
    this.$resizeContainer()
  }

  /**
   * Return all cards in hand
   */
  public get cards(): Card[] {
    return this.$hand
  }

  /**
   * Add card to hand and resize
   */
  public drawCard(card: Card | undefined, callback?: () => void): void {
    if (!card) {
      callback?.()
      return
    }

    this.$hand.push(card)
    card.setContext('HAND')

    this.$animationManager.addToContainer(card, this.$handContainer, () => {
      this.$resizeContainer()
      callback?.()
    })
  }

  public playCard(card: Card, callback?: () => void): void {
    // Prepare remove card from hand function
    const removeFromHand = () => {
      const index = this.$hand.findIndex((handCard) => handCard === card)
      this.$hand.splice(index, 1)
      callback?.() // Play card on board
      this.$handContainer.remove(card.container, true)
      this.$resizeContainer()
    }

    // If player, execute function, if not, play PlayCardAnimation and then execute function
    if (this.$owner === TARGET_KEYS.PLAYER) {
      removeFromHand()
      return
    }
    this.$animationManager.animateCardFromHandToBoard(card, removeFromHand)
  }

  /**
   * Create empty hand container
   */
  private $createContainer(): void {
    this.$handContainer = this.$scene.add.container()
  }

  /**
   * Resize container and reposition it
   */
  private $resizeContainer(): void {
    resizeContainer(this.$handContainer, () =>
      repositionContainer(
        this.$handContainer,
        this.$scene.scale.width / 2 - Math.max(this.$handContainer.width, CARD_CONFIG.SIZE.WIDTH) / 2,
        this.$owner === TARGET_KEYS.PLAYER
          ? this.$scene.scale.height - Math.max(this.$handContainer.height, CARD_CONFIG.SIZE.HEIGHT)
          : 0
      )
    )
  }
}
