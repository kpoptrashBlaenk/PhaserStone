import { BattleScene } from '../scenes/battle-scene'
import { TargetKeys } from '../utils/keys'
import { resizeContainer } from '../utils/resize-container'
import { BoardCard } from './card/board-card'
import { CardData } from './card/card-keys'

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
  public playCard(card: CardData): void {
    const cardPlayed = new BoardCard(this.scene, card, this.owner)
    this.board.push(cardPlayed)
    this.boardContainer.add(cardPlayed.cardUI)
    this.resizeBoardContainer()
  }

  /**
   * Resize boardContainer and reposition it
   */
  private resizeBoardContainer(): void {
    resizeContainer(this.boardContainer, () => {
      this.setPosition()
    })
  }

  /**
   * Set Position of boardContainer
   */
  private setPosition(): void {
    this.boardContainer.setPosition(
      this.scene.scale.width / 2 - this.boardContainer.width / 2,
      BOARD_POSITION_Y[this.owner]
    )
  }

  /**
   * Create boardContainer
   */
  private createBoardContainer(): Phaser.GameObjects.Container {
    return this.scene.add.container()
  }
}
