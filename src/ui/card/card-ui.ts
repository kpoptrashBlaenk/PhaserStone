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

const CARD_COST_PADDING = {
  x: 25,
  y: 30,
}
const CARD_ATTACK_PADDING = {
  x: 25,
  y: -58,
}
const CARD_HEALTH_PADDING = {
  x: -50,
  y: -58,
}

const CARD_NAME_PADDING = {
  x: 0,
  y: 200,
}

export class CardUI {
  public cardContainer: Phaser.GameObjects.Container
  protected scene: Phaser.Scene
  protected card: Card
  protected cardImage: Phaser.GameObjects.Image
  protected cardCostText: Phaser.GameObjects.Text
  protected cardAttackText: Phaser.GameObjects.Text
  protected cardHealthText: Phaser.GameObjects.Text
  protected cardNameText: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene, card: Card) {
    this.scene = scene
    this.card = card

    this.createCardObject(card)
  }

  /**
   * Get Card data of this CardUI
   */
  public get thisCard(): Card {
    return this.card
  }

  /**
   * Create card object with: Image, Text, Cost, Attack, Health, Name
   */
  private createCardObject(card: Card): void {
    this.cardImage = this.scene.add.image(0, 0, card.assetKey).setOrigin(0)
    this.cardContainer = this.scene.add
      .container(0, 0, this.cardImage)
      .setSize(this.cardImage.width, this.cardImage.height)

    this.cardCostText = this.scene.add.text(
      this.cardImage.x + CARD_COST_PADDING.x,
      this.cardImage.y + CARD_COST_PADDING.y,
      String(card.cost),
      CARD_NUMBER_FONT_STYLE
    )
    this.cardAttackText = this.scene.add.text(
      this.cardImage.x + CARD_ATTACK_PADDING.x,
      this.cardImage.y + this.cardImage.height + CARD_ATTACK_PADDING.y,
      String(card.attack),
      CARD_NUMBER_FONT_STYLE
    )
    this.cardHealthText = this.scene.add.text(
      this.cardImage.x + this.cardImage.width + CARD_HEALTH_PADDING.x,
      this.cardImage.y + this.cardImage.height + CARD_HEALTH_PADDING.y,
      String(card.health),
      CARD_NUMBER_FONT_STYLE
    )
    this.cardNameText = this.scene.add.text(
      0,
      this.cardImage.y + CARD_NAME_PADDING.y,
      card.name,
      CARD_NAME_FONT_STYLE
    )
    this.cardNameText.setX(this.cardImage.x + this.cardImage.width / 2 - this.cardNameText.width / 2)

    this.cardContainer.add([this.cardCostText, this.cardAttackText, this.cardHealthText, this.cardNameText])
  }
}
