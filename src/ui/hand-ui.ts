import { Card } from '../gameObjects/card'
import { HandCardUI } from './card/hand-card-ui'
import { PreviewUI } from './preview-ui'

export class HandUI {
  private scene: Phaser.Scene
  private handContainer: Phaser.GameObjects.Container
  private previewUI: PreviewUI
  private onPlayCallback: (card: Card) => void

  constructor(scene: Phaser.Scene, previewUI: PreviewUI, onPlayCallback: (card: Card) => void) {
    this.scene = scene
    this.previewUI = previewUI
    this.onPlayCallback = onPlayCallback

    this.createHandContainer()
  }

  public getCardContainer(card: Card): Phaser.GameObjects.Container | null {
    for (const cardContainer of this.handContainer.getAll()) {
      const handCardUI = cardContainer.getData('handCardUI') as HandCardUI
      if (handCardUI && handCardUI.thisCard === card) {
        return cardContainer as Phaser.GameObjects.Container // Promise this is a Container
      }
    }

    return null // If no card
  }

  public drawCard(card: Card): void {
    const cardContainer = new HandCardUI(this.scene, card, this.previewUI, this.onPlayCallback)
    this.handContainer.add(cardContainer.cardContainer)
    cardContainer.cardContainer.setData('handCardUI', cardContainer)
    this.resizeHandContainer()
  }

  public playCard(card: Phaser.GameObjects.Container): void {
    this.handContainer.remove(card, true)
    this.resizeHandContainer()
  }

  private createHandContainer(): void {
    this.handContainer = this.scene.add.container()
  }

  private resizeHandContainer(): void {
    // Also reposition it
    const padding = 10
    let newWidth = 0
    let newHeight = 0
    let index = 0

    this.handContainer.iterate((child: Phaser.GameObjects.Container) => {
      child.setX(child.width * index)
      newWidth += child.width
      newHeight = child.height + padding
      index++
    })

    this.handContainer.width = newWidth
    this.handContainer.height = newHeight
    this.handContainer.setPosition(
      this.scene.scale.width / 2 - this.handContainer.width / 2,
      this.scene.scale.height - this.handContainer.height
    )
  }
}
