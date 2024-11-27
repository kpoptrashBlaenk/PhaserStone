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
  protected scene: Phaser.Scene
  protected boardContainer: Phaser.GameObjects.Container
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

  private setEvents(): void {
    onCardPlayedOnBoard(this.emitter, ({ player, card }) => {
      if (player === this.owner) {
        this.playCard(card)
      }
    })
  }

  public getCardContainer(card: Card): Phaser.GameObjects.Container | null {
    for (const cardContainer of this.boardContainer.getAll()) {
      const handCardUI = cardContainer.getData('handCardUI') as BoardCardUI
      if (handCardUI && handCardUI.thisCard === card) {
        return cardContainer as Phaser.GameObjects.Container // Promise this is a Container
      }
    }

    return null // If no card
  }

  public playCard(card: Card) {
    const cardContainer = new BoardCardUI(this.scene, card, this.previewUI)
    this.boardContainer.add(cardContainer.cardContainer)
    cardContainer.cardContainer.setData('boardCardUI', cardContainer)
    this.resizeBoardContainer()
  }

  protected setPosition(): void {
    if (this.owner === TARGETS_KEYS.PLAYER) {
      const { x, y } = this.calculatePosition(BOARD_PADDING.PLAYER)
      this.boardContainer.setPosition(x, y)
    } else {
      const { x, y } = this.calculatePosition(BOARD_PADDING.OPPONENT - this.boardContainer.height)
      this.boardContainer.setPosition(x, y)
    }
  }

  protected calculatePosition(paddingY: number): { x: number; y: number } {
    return {
      x: this.scene.scale.width / 2 - this.boardContainer.width / 2,
      y: this.scene.scale.height / 2 + paddingY,
    }
  }

  private createBoardContainer(): void {
    this.boardContainer = this.scene.add.container()
  }

  private resizeBoardContainer() {
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
