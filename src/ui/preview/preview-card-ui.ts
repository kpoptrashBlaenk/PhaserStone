import { Card } from '../../gameObjects/card'
import { CardUI } from '../card/card-ui'

const CARD_NAME_PADDING_X = 10

export class PreviewCardUI extends CardUI {
  constructor(scene: Phaser.Scene, card: Card) {
    super(scene, card)

    this.forPreview()
    this.setPosition()
  }

  protected setPosition(): void {
    console.log('This method is a placeholder for setting the position of the preview cards')
  }

  private forPreview(): void {
    this.cardContainer.setScale(1)
    this.cardContainer.setAlpha(0)
  }

  public modifyPreviewCardObjects(card: Card): void {
    this.cardImage.setTexture(card.assetKey)
    this.cardCostText.setText(String(card.cost))
    this.cardAttackText.setText(String(card.attack))
    this.cardHealthText.setText(String(card.health))
    this.cardNameText.setText(card.name)
    this.cardNameText.setX(
      this.cardImage.x + this.cardImage.width / 2 - this.cardNameText.width / 2 + CARD_NAME_PADDING_X
    )
    this.cardContainer.setAlpha(1)
  }

  public hidePreviewCardObject(): void {
    this.cardContainer.setAlpha(0)
  }
}
