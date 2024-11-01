import { FONT_KEYS } from '../../assets/font-keys'
import { Card } from '../../gameObjects/card'

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
  protected scene: Phaser.Scene
  protected card: Card
  protected cardImage: Phaser.GameObjects.Image
  protected cardCostText: Phaser.GameObjects.Text
  protected cardAttackText: Phaser.GameObjects.Text
  protected cardHealthText: Phaser.GameObjects.Text
  protected cardNameText: Phaser.GameObjects.Text
  // TODO: private cardEffectsText: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene, card: Card) {
    this.scene = scene
    this.card = card

    this.createCardObject(card)
  }

  private createCardObject(card: Card): void {
    this.cardImage = this.scene.add.image(0, 0, card.assetKey).setOrigin(0)
    this.cardContainer = this.scene.add
      .container(0, 0, this.cardImage)
      .setSize(this.cardImage.width, this.cardImage.height)

    this.cardCostText = this.scene.add.text(
      this.cardImage.x + 25,
      this.cardImage.y + 30,
      String(card.cost),
      CARD_NUMBER_FONT_STYLE
    )
    this.cardAttackText = this.scene.add.text(
      this.cardImage.x + 28,
      this.cardImage.y + this.cardImage.height - 58,
      String(card.attack),
      CARD_NUMBER_FONT_STYLE
    )
    this.cardHealthText = this.scene.add.text(
      this.cardImage.x + this.cardImage.width - 50,
      this.cardImage.y + this.cardImage.height - 58,
      String(card.health),
      CARD_NUMBER_FONT_STYLE
    )
    this.cardNameText = this.scene.add.text(0, this.cardImage.y + 200, card.name, CARD_NAME_FONT_STYLE)
    this.cardNameText.setX(this.cardImage.x + this.cardImage.width / 2 - this.cardNameText.width / 2 + 10) // + 10 because not centered, idk why

    this.cardContainer.add([this.cardCostText, this.cardAttackText, this.cardHealthText, this.cardNameText])
  }
}
