import { BattleScene } from '../scenes/battle-scene'
import { TargetKeys } from '../utils/keys'
import { BoardCard } from './card/board-card'
import { CardData } from './card/card-keys'

const BOARD_POSITION_Y = {
  PLAYER: 500,
  OPPONENT: 330,
}

export class Board {
  private scene: BattleScene
  private owner: TargetKeys
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
   * Create BoardCard -> Add it to boardContainer -> Resize boardContainer
   */
  public playCard(card: CardData): void {
    const cardPlayed = new BoardCard(this.scene, card, this.owner)
    this.board.push(cardPlayed)
    this.boardContainer.add(cardPlayed.cardUI)
    this.resizeBoardContainer()
  }

  /**
   * Resize boardContainer
   */
  private resizeBoardContainer(): void {
    // Also reposition it
    const padding = 10
    let newWidth = 0
    let newHeight = 0
    let index = 0

    this.boardContainer.iterate((child: Phaser.GameObjects.Container) => {
      child.setX(child.width * index)
      newWidth += child.width
      newHeight = child.height + padding
      index++
    })

    this.boardContainer.width = newWidth
    this.boardContainer.height = newHeight
    this.setPosition()
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
