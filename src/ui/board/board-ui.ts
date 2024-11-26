import { Card } from '../../gameObjects/card'
import { BoardCardUI } from '../card/board-card-ui'
import { PlayerPreviewUI } from '../preview/player-preview-ui'

export class BoardUI {
  protected scene: Phaser.Scene
  protected boardContainer: Phaser.GameObjects.Container
  private previewUI: PlayerPreviewUI

  constructor(scene: Phaser.Scene, previewUI: PlayerPreviewUI) {
    this.scene = scene
    this.previewUI = previewUI

    this.createBoardContainer()
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

  protected setPosition(): void {
    console.log('Placeholder method for setting position')
  }
}
