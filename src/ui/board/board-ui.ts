import { TargetKeys, TARGETS_KEYS } from '../../utils/event-keys'
import { Card } from '../../gameObjects/card'
import { BoardCardUI } from '../card/board-card-ui'
import { PreviewUI } from '../preview/preview-ui'
import { onCardPlayedOnBoard } from '../../utils/event-listeners'

export const BOARD_PADDING = {
  PLAYER: -10,
  OPPONENT: -40,
}

export class BoardUI {
  private scene: Phaser.Scene
  private boardContainer: Phaser.GameObjects.Container
  private previewUI: PreviewUI
  private owner: TargetKeys
  private emitter: Phaser.Events.EventEmitter

  constructor(
    scene: Phaser.Scene,
    previewUI: PreviewUI,
    owner: TargetKeys,
    emitter: Phaser.Events.EventEmitter
  ) {
    this.owner = owner
    this.emitter = emitter
    this.scene = scene
    this.previewUI = previewUI

    this.createBoardContainer()
    this.setEvents()
  }

  /**
   * Listeners: CardPlayedOnBoard
   */
  private setEvents(): void {
    onCardPlayedOnBoard(this.emitter, ({ player, card }) => {
      if (player === this.owner) {
        this.playCard(card)
      }
    })
  }

  /**
   * Create BoardCardU ->
   * Add it to boardContainer ->
   * Set data of boardCardUI ->
   * Resize
   */
  private playCard(card: Card): void {
    const cardContainer = new BoardCardUI(this.scene, card, this.previewUI)
    this.boardContainer.add(cardContainer.cardContainer)
    cardContainer.cardContainer.setData('boardCardUI', cardContainer)
    this.resizeBoardContainer()
  }

  /**
   * Set Position of boardContainer
   */
  private setPosition(): void {
    if (this.owner === TARGETS_KEYS.PLAYER) {
      const { x, y } = this.calculatePosition(BOARD_PADDING.PLAYER)
      this.boardContainer.setPosition(x, y)
    } else {
      const { x, y } = this.calculatePosition(BOARD_PADDING.OPPONENT - this.boardContainer.height)
      this.boardContainer.setPosition(x, y)
    }
  }

  /**
   * Calculate Position of boardContainer
   */
  private calculatePosition(paddingY: number): { x: number; y: number } {
    return {
      x: this.scene.scale.width / 2 - this.boardContainer.width / 2,
      y: this.scene.scale.height / 2 + paddingY,
    }
  }

  /**
   * Create boardContainer
   */
  private createBoardContainer(): void {
    this.boardContainer = this.scene.add.container()
  }

  /**
   * Resize boardContainer when amount of cards inside change
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
}
