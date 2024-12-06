import { BattleScene } from '../scenes/battle-scene'
import { TargetKeys } from '../utils/keys'
import { repositionContainer, resizeContainer } from '../utils/resize-container'
import { BoardCard } from './card/board-card'
import { CardData } from './card/card-keys'
import { HandCard } from './card/hand-card'

export const BOARD_POSITION_Y = {
  PLAYER: 500,
  OPPONENT: 330,
}

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
   * Set the depth of board container for making attacking minion over opponent
   */
  public set depth(depth: 0 | 1) {
    this.boardContainer.setDepth(depth)
  }

  /**
   * Remove cardUI and card from board
   */
  public cardDies(card: BoardCard): void {
    const index = this.board.findIndex((boardCard) => boardCard === card)
    this.board.splice(index, 1)
    this.boardContainer.remove(card.cardUI, true)
    this.resizeBoardContainer()
  }

  /**
   * Create BoardCard -> Add it to boardContainer -> Resize boardContainer
   */
  public playCard(card: HandCard): void {
    const cardPlayed = new BoardCard(this.scene, card.cardData, this.owner)
    this.board.push(cardPlayed)

    const originalPositionX = card.cardUI.getBounds().x
    const originalPositionY = card.cardUI.getBounds().y

    this.boardContainer.add(cardPlayed.cardUI)
    this.resizeBoardContainer()

    const newPositionX = cardPlayed.cardUI.x
    const newPositionY = cardPlayed.cardUI.y

    cardPlayed.cardUI.setPosition(
      originalPositionX - this.boardContainer.x,
      originalPositionY - this.boardContainer.y
    )

    // Moving to Board Animation
    this.scene.tweens.add({
      targets: cardPlayed.cardUI,
      x: newPositionX,
      y: newPositionY,
      duration: 250,
      ease: 'Sine.easeOut',
    })
  }

  /**
   * Resize boardContainer and reposition it
   */
  private resizeBoardContainer(): void {
    resizeContainer(this.boardContainer, () => {
      repositionContainer(
        this.boardContainer,
        this.scene.scale.width / 2 - this.boardContainer.width / 2,
        BOARD_POSITION_Y[this.owner]
      )
    })
  }

  /**
   * Create boardContainer
   */
  private createBoardContainer(): Phaser.GameObjects.Container {
    return this.scene.add.container()
  }
}
