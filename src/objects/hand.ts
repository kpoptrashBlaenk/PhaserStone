import { resizeContainer } from '../common/resize-container'
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
   * Add card to hand and resize
   */
  public drawCard(card: Card | undefined, callback?: () => void): void {
    if (!card) {
      callback?.()
      return
    }
    this.$hand.push(card)

    this.$animationManager.addToContainer(card, this.$handContainer, () => this.$resizeContainer())
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
    resizeContainer(
      this.$handContainer,
      this.$scene.scale.width / 2 - Math.max(this.$handContainer.width, CARD_CONFIG.SIZE.WIDTH) / 2,
      this.$owner === TARGET_KEYS.PLAYER
        ? this.$scene.scale.height - Math.max(this.$handContainer.height, CARD_CONFIG.SIZE.HEIGHT)
        : 0
    )
  }
}
