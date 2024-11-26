import { CARD_ASSETS_KEYS } from '../../assets/asset-keys'
import { Card } from '../../gameObjects/card'
import { CardUI } from './card-ui'

export class OpponentHandCardUI extends CardUI {
  constructor(scene: Phaser.Scene, card: Card) {
    super(scene, card)

    // Show Card Back and Hide GameObjects for Opponents Hand Cards
    this.cardImage.setTexture(CARD_ASSETS_KEYS.CARD_BACK)
    this.cardCostText.setAlpha(0)
    this.cardAttackText.setAlpha(0)
    this.cardHealthText.setAlpha(0)
    this.cardNameText.setAlpha(0)
    this.forHand()
  }

  private forHand(): void {
    this.cardContainer.setScale(0.36)
    this.cardContainer.setSize(
      this.cardContainer.width * this.cardContainer.scaleX,
      this.cardContainer.height * this.cardContainer.scaleY
    )
  }
}
