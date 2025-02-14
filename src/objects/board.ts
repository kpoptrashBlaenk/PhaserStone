import { repositionContainer, resizeContainer } from '../common/resize-container'
import { AnimationManager } from '../managers/animation-manager'
import { TargetKeys } from '../utils/keys'
import { BOARD_CONFIG, CARD_CONFIG } from '../utils/visual-configs'
import { Card } from './card'

/**
 * The Board class handles board related actions
 */
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

  /**
   * Return all board cards
   */
  public get cards(): Card[] {
    return this.$board
  }

  /**
   * Set depth to avoid having the attacking card be under the defending card
   * 
   * @param value Depth, usually 1 or 0
   */
  public setDepth(value: number): void {
    this.$boardContainer.depth = value
  }

  /**
   * Set card context to 'BOARD' then animate add to container with {@link $resizeContainer()} as callback
   * @param card Card played
   */
  public playCard(card: Card): void {
    if (!card) {
      return
    }
    this.$board.push(card)
    card.setContext('BOARD')

    this.$animationManager.addToContainer(card, this.$boardContainer, () => {
      this.$resizeContainer()
    })
  }

  /**
   * Remove card and from board then do die() from card then {@link $resizeContainer()}
   * 
   * @param card Card that died
   */
  public cardDies(card: Card): void {
    const index = this.$board.findIndex((boardCard) => boardCard === card)
    this.$board.splice(index, 1)
    card.die()
    this.$boardContainer.remove(card.container, true)
    this.$resizeContainer()
  }

  /**
   * Create board container
   */
  private $createContainer(): void {
    this.$boardContainer = this.$scene.add.container()
  }

  /**
   * {@link resizeContainer()} with {@link repositionContainer()} as callback
   */
  private $resizeContainer(): void {
    resizeContainer(this.$boardContainer, () =>
      repositionContainer(
        this.$boardContainer,
        this.$scene.scale.width / 2 - Math.max(this.$boardContainer.width, CARD_CONFIG.SIZE.WIDTH) / 2,
        BOARD_CONFIG.POSITION_Y[this.$owner]
      )
    )
  }
}
