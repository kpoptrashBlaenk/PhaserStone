import { BattleScene } from '../scenes/battle-scene'
import { TARGET_KEYS, TargetKeys } from '../../../src/utils/keys'
import { repositionContainer, resizeContainer } from '../common/resize-container'
import { BOARD_CONFIGS, BOARD_POSITION_Y, HAND_CARD_SIZE, RESIZE_CONFIGS } from '../utils/visual-configs'
import { BoardCard } from './card/board-card'
import { HandCard } from './card/hand-card'
import { MAX_BOARD } from '../../../src/utils/configs'

export class Board {
  private owner: TargetKeys
  private scene: BattleScene
  private boardContainer: Phaser.GameObjects.Container
  private board: BoardCard[]

  constructor(scene: BattleScene, owner: TargetKeys) {
    this.scene = scene
    this.owner = owner

    this.board = []
    this.boardContainer = this.createBoardContainer()
    this.resizeBoardContainer()
  }

  /**
   * Return all board cards (used for resetting minions attack state)
   */
  public get boardCards(): BoardCard[] {
    return this.board
  }

  /**
   * Checks if board has space (less than MAX_BOARD = 7)
   */
  public get hasSpace(): boolean {
    return this.board.length < MAX_BOARD
  }

  /**
   * Set the depth of board container for making attacking minion over opponent
   */
  public set depth(depth: 0 | 1) {
    this.boardContainer.setDepth(depth)
  }

  /**
   * Remove cardUI and card from board
   */
  public cardDies(card: BoardCard, callback?: () => void): void {
    const index = this.board.findIndex((boardCard) => boardCard === card)
    this.board.splice(index, 1)
    this.boardContainer.remove(card.container, true)
    this.resizeBoardContainer(callback)
  }

  /**
   * Create BoardCard -> Add it to boardContainer -> Resize boardContainer
   */
  public playCard(card: HandCard): void {
    const cardPlayed = new BoardCard(this.scene, card.cardData, this.owner)
    this.board.push(cardPlayed)

    const originalPositionX = card.container.getBounds().x
    const originalPositionY = card.container.getBounds().y

    this.boardContainer.add(cardPlayed.container)

    // Place card to the right of container then resize
    const newPositionX = this.boardContainer.width
    const newPositionY = 0

    cardPlayed.container.setPosition(
      originalPositionX - this.boardContainer.x,
      originalPositionY - this.boardContainer.y
    )

    // Moving to Board Animation
    this.scene.tweens.add({
      targets: cardPlayed.container,
      x: newPositionX,
      y: newPositionY,
      duration: BOARD_CONFIGS.HAND_TO_BOARD.DURATION,
      ease: BOARD_CONFIGS.HAND_TO_BOARD.EASE,
      onComplete: () => {
        this.resizeBoardContainer()
      },
    })
  }

  /**
   * Resize boardContainer and reposition it
   */
  private resizeBoardContainer(callback?: () => void): void {
    resizeContainer(this.boardContainer, () => {
      repositionContainer(
        this.boardContainer,
        this.scene.scale.width / 2 - Math.max(this.boardContainer.width, HAND_CARD_SIZE.width) / 2,
        BOARD_POSITION_Y[this.owner]
      )
    })

    // Because callback needs to be passed through too many callbacks
    setTimeout(() => callback?.(), RESIZE_CONFIGS.DURATION)
  }

  /**
   * Create boardContainer
   */
  private createBoardContainer(): Phaser.GameObjects.Container {
    return this.scene.add.container()
  }
}