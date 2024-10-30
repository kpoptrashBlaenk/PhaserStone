import { Card } from '../gameObjects/card'

export class CardUI {
  public cardContainer: Phaser.GameObjects.Container
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene, card: Card) {
    this.scene = scene

    const cardImage = this.scene.add.image(0, 0, card.assetKey).setOrigin(0)
    this.cardContainer = this.scene.add.container(0, 0, cardImage).setScale(0.18).setSize(cardImage.width, cardImage.height)
  }
}
