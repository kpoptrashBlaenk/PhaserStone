import { repositionContainer, resizeContainer } from '../common/resize-container'
import { AnimationManager } from '../utils/animation-manager'
import { TargetKeys } from '../utils/keys'
import { BOARD_CONFIG, CARD_CONFIG } from '../utils/visual-configs'
import { Card } from './card'

export class Board {
  private $scene: Phaser.Scene
  private $owner: TargetKeys
  private $animationManager: AnimationManager
  private $board: Card[]
  private $boardContainer: Phaser.GameObjects.Container

  constructor(scene: Phaser.Scene, owner: TargetKeys, animationManager: AnimationManager) {
    this.$scene = scene
    this.$owner = owner
    this.$animationManager = animationManager
    this.$board = []

    this.$createContainer()
    this.$resizeContainer()
  }

  public get cards(): Card[] {
    return this.$board
  }

  public setDepth(value: number): void {
    this.$boardContainer.depth = value
  }

  /**
   * Play card
   */
  public playCard(card: Card, callback?: () => void): void {
    if (!card) {
      callback?.()
      return
    }
    this.$board.push(card)
    card.setContext('BOARD')

    this.$animationManager.addToContainer(card, this.$boardContainer, () => {
      this.$resizeContainer()
      callback?.()
    })
  }

  /**
   * Remove cardUI and card from board
   */
  public cardDies(card: Card, callback?: () => void): void {
    const index = this.$board.findIndex((boardCard) => boardCard === card)
    this.$board.splice(index, 1)
    card.die()
    this.$boardContainer.remove(card.container, true)
    this.$resizeContainer(callback)
  }

  /**
   * Create empty board container
   */
  private $createContainer(): void {
    this.$boardContainer = this.$scene.add.container()
  }

  /**
   * Resize container and reposition it
   */
  private $resizeContainer(callback?: () => void): void {
    resizeContainer(this.$boardContainer, () =>
      repositionContainer(
        this.$boardContainer,
        this.$scene.scale.width / 2 - Math.max(this.$boardContainer.width, CARD_CONFIG.SIZE.WIDTH) / 2,
        BOARD_CONFIG.POSITION_Y[this.$owner],
        callback
      )
    )
  }
}
