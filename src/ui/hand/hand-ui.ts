import { Card } from '../../gameObjects/card'
import { OpponentHandCardUI } from '../card/opponent-hand-card-ui'

export class BaseHandUI {
  protected scene: Phaser.Scene
  protected handContainer: Phaser.GameObjects.Container
  protected onPlayCallback: (card: Card) => void

  constructor(scene: Phaser.Scene, onPlayCallback: (card: Card) => void) {
    this.scene = scene
    this.onPlayCallback = onPlayCallback

    this.createHandContainer()
  }

  public getCardContainer(card: Card): Phaser.GameObjects.Container | null {
    for (const cardContainer of this.handContainer.getAll()) {
      const handCardUI = cardContainer.getData('handCardUI') as OpponentHandCardUI
      if (handCardUI && handCardUI.thisCard === card) {
        return cardContainer as Phaser.GameObjects.Container // Promise this is a Container
      }
    }

    return null // If no card
  }

  public playCard(card: Phaser.GameObjects.Container): void {
    this.handContainer.remove(card, true)
    this.resizeHandContainer()
  }

  protected resizeHandContainer(): void {
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
    this.setPosition()
  }

  protected setPosition(): void {
    console.log('Placeholder method for setting position')
  }

  private createHandContainer(): void {
    this.handContainer = this.scene.add.container()
  }
}