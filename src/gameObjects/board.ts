import { TARGET_KEYS, TargetKeys } from '../utils/keys'
import { HandCard } from './card/hand-card'

const BOARD_POSITION_Y = {
  PLAYER: 500,
  OPPONENT: 330,
}

export class Board {
  private scene: Phaser.Scene
  private owner: TargetKeys
  private boardContainer: Phaser.GameObjects.Container
  private board: HandCard[]

  constructor(scene: Phaser.Scene, owner: TargetKeys) {
    this.scene = scene
    this.owner = owner

    this.board = []
    this.boardContainer = this.createBoardContainer()
  }

  /**
   * Create HandCardUI -> Add it to boardContainer -> Set data of handCardUI -> Resize boardContainer
   */
  public playCard(card: HandCard): void {
    this.board.push(card)
    this.boardContainer.add(card.cardUI)
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
