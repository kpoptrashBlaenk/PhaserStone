import { Card } from '../../gameObjects/card'
import { CardUI } from './card-ui'

export class PreviewCardUI extends CardUI {
  constructor(scene: Phaser.Scene, card: Card) {
    super(scene, card)

    this.forPreview()
  }

  private forPreview(): void {
    const padding = 20
    this.cardContainer.setScale(1)
    this.cardContainer.setPosition(
      this.scene.scale.width - this.cardContainer.width * this.cardContainer.scaleX - padding,
      padding * 2
    )
    this.cardContainer.setAlpha(0)
  }

  public modifyPreviewCardObjects(card: Card): void {
    this.cardImage.setTexture(card.assetKey)
    this.cardCostText.setText(String(card.cost))
    this.cardAttackText.setText(String(card.attack))
    this.cardHealthText.setText(String(card.health))
    this.cardNameText.setText(card.name)
    this.cardNameText.setX(this.cardImage.x + this.cardImage.width / 2 - this.cardNameText.width / 2 + 10)
    this.cardContainer.setAlpha(1)
  }

  public hidePreviewCardObject(): void {
    this.cardContainer.setAlpha(0)
  }
}
