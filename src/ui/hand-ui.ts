import { Card } from '../gameObjects/card'
import { CardUI } from './card-ui'
import { PreviewUI } from './preview-ui'

export class HandUI {
  private scene: Phaser.Scene
  private handContainer: Phaser.GameObjects.Container
  private previewUI: PreviewUI

  constructor(scene: Phaser.Scene, previewUI: PreviewUI) {
    this.scene = scene
    this.previewUI = previewUI

    this.createHandContainer()
  }

  public drawCard(card: Card) {
    const cardContainer = new CardUI(this.scene, card)
    cardContainer.forHand(this.previewUI)
    this.handContainer.add(cardContainer.cardContainer)
    this.resizeHandContainer()
  }

  private createHandContainer() {
    this.handContainer = this.scene.add.container()
  }

  private resizeHandContainer() {
    // Also reposition it
    let newWidth = 0
    let newHeight = 0
    let index = 0

    this.handContainer.iterate((child: Phaser.GameObjects.Container) => {
      child.setX(child.width * index)
      newWidth += child.width
      newHeight = child.height + 35 // Adjusted because black border
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
