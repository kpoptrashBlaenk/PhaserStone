import { repositionContainer, resizeContainer } from '../common/resize-container'
import { AnimationManager } from '../managers/animation-manager'
import { TARGET_KEYS, TargetKeys } from '../utils/keys'
import { CARD_CONFIG } from '../utils/visual-configs'
import { Card } from './card'

/**
 * The Hand class handles all hand related actions
 */
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
   * Return {@link $hand}
   */
  public get cards(): Card[] {
    return this.$hand
  }

  /**
   * If card then add to hand and set cards context then {@link $resizeContainer()} with callback as callback
   * 
   * @param card Card drawn
   * @param callback Usually setting state to player or enemy turn
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

  /**
   * Remove card from hand then animate it to board
   * 
   * @param card Card played
   * @param callback This is afterPlayCallback() in battle scene that also has a callback as param
   * @returns 
   */
  public playCard(card: Card, callback?: (callback: () => void) => void): void {
    // Prepare remove card from hand function
    const removeFromHand = () => {
      const index = this.$hand.findIndex((handCard) => handCard === card)
      this.$hand.splice(index, 1)
      callback?.(() => {
        this.$handContainer.remove(card.container, true)
        this.$resizeContainer()
      }) // Play card on board AFTER animations
    }

    // If player, execute function, if not, play PlayCardAnimation and then execute function
    if (this.$owner === TARGET_KEYS.PLAYER) {
      removeFromHand()
      return
    }
    this.$animationManager.animateCardFromHandToBoard(card, removeFromHand)
  }

  /**
   * Create {@link $handContainer}
   */
  private $createContainer(): void {
    this.$handContainer = this.$scene.add.container().setDepth(1)
  }

  /**
   * {@link resizeContainer()} with {@link repositionContainer()} as callback
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
