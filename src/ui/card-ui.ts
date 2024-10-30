import { FONT_KEYS } from '../assets/font-keys'
import { Card } from '../gameObjects/card'

const CARD_NUMBER_FONT_STYLE = Object.freeze({
  fontFamily: FONT_KEYS.HEARTHSTONE,
  fontSize: '48px',
  fontStyle: 'bold',
  stroke: '#00000',
  strokeThickness: 4,
})

const CARD_NAME_FONT_STYLE = Object.freeze({
  ...CARD_NUMBER_FONT_STYLE,
  fontSize: '26px',
})

export class CardUI {
  public cardContainer: Phaser.GameObjects.Container
  private cardCostText: Phaser.GameObjects.Text
  private cardAttackText: Phaser.GameObjects.Text
  private cardHealthText: Phaser.GameObjects.Text
  private cardNameText: Phaser.GameObjects.Text
  // TODO: private cardEffectsText: Phaser.GameObjects.Text
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene, card: Card) {
    this.scene = scene

    this.createCardObjects(card)
  }

  private createCardObjects(card: Card): void {
    const cardImage = this.scene.add.image(0, 0, card.assetKey).setOrigin(0)
    this.cardContainer = this.scene.add
      .container(0, 0, cardImage)
      .setScale(0.18)
      .setSize(cardImage.width, cardImage.height)

    this.cardCostText = this.scene.add.text(
      cardImage.x + 25,
      cardImage.y + 30,
      String(card.cost),
      CARD_NUMBER_FONT_STYLE
    )
    this.cardAttackText = this.scene.add.text(
      cardImage.x + 28,
      cardImage.y + cardImage.height - 58,
      String(card.attack),
      CARD_NUMBER_FONT_STYLE
    )
    this.cardHealthText = this.scene.add.text(
      cardImage.x + cardImage.width - 50,
      cardImage.y + cardImage.height - 58,
      String(card.health),
      CARD_NUMBER_FONT_STYLE
    )
    this.cardNameText = this.scene.add.text(0, cardImage.y + 200, card.name, CARD_NAME_FONT_STYLE)
    this.cardNameText.setX(cardImage.x + cardImage.width / 2 - this.cardNameText.width / 2 + 10) // + 10 because not centered, idk why

    this.cardContainer.add([this.cardCostText, this.cardAttackText, this.cardHealthText, this.cardNameText])
  }
}
