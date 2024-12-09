import { FONT_KEYS } from '../../assets/font-keys'
import { BattleScene } from '../../scenes/battle-scene'
import { CardData } from './card-keys'

export const CARD_NUMBER_FONT_STYLE = Object.freeze({
  fontFamily: FONT_KEYS.HEARTHSTONE,
  fontSize: '48px',
  fontStyle: 'bold',
  stroke: '#00000',
  strokeThickness: 4,
})

const CARD_NAME_FONT_STYLE_BIG = Object.freeze({
  ...CARD_NUMBER_FONT_STYLE,
  fontSize: '26px',
})

const CARD_NAME_FONT_STYLE_SMALL = Object.freeze({
  ...CARD_NUMBER_FONT_STYLE,
  fontSize: '18px',
})

const CARD_COST_POSITION = {
  x: 23,
  y: 30,
}
const CARD_ATTACK_POSITION = {
  x: 27,
  y: 322,
}
const CARD_HEALTH_POSITION = {
  x: 218,
  y: 325,
}
const CARD_NAME_POSITION = {
  y: 215,
}

export class Card {
  protected originalCard: CardData
  protected card: CardData
  protected scene: BattleScene
  protected cardContainer: Phaser.GameObjects.Container
  protected cardImage: Phaser.GameObjects.Image
  protected cardCostText: Phaser.GameObjects.Text
  protected cardAttackText: Phaser.GameObjects.Text
  protected cardHealthText: Phaser.GameObjects.Text
  protected cardNameText: Phaser.GameObjects.Text

  constructor(scene: BattleScene, card: CardData) {
    this.scene = scene
    this.card = Object.assign({}, card)
    this.originalCard = Object.freeze({ ...card }) // Create copy so original won't change when card changes

    this.cardContainer = this.createCardObject(this.card)
  }

  public get cardUI(): Phaser.GameObjects.Container {
    return this.cardContainer
  }

  public get cardData(): CardData {
    return this.card
  }

  /**
   * Hides Card
   */
  public hideCard() {
    this.cardContainer.setAlpha(0)
  }

  /**
   * Shows Card
   */
  public showCard() {
    this.cardContainer.setAlpha(1)
  }

  protected setCardText(text: string): void {
    this.cardNameText.setText(text)
    this.cardNameText.setStyle(text.length < 15 ? CARD_NAME_FONT_STYLE_BIG : CARD_NAME_FONT_STYLE_SMALL)
  }

  /**
   * Sets stats then check for changes and apply colors
   */
  protected setStats(): void {
    const changeAndCheck = (current: number, original: number, textObject: Phaser.GameObjects.Text): void => {
      textObject.setText(String(current))

      if (current > original) {
        textObject.setColor('#00FF00')
      } else if (current < original) {
        textObject.setColor('#FF0000')
      } else {
        textObject.setColor('#FFFFFF')
      }
    }

    changeAndCheck(this.card.attack, this.originalCard.attack, this.cardAttackText)
    changeAndCheck(this.card.health, this.originalCard.health, this.cardHealthText)
    changeAndCheck(this.card.cost, this.originalCard.cost, this.cardCostText)
  }

  /**
   * Create card object with: Image, Text, Cost, Attack, Health, Name
   */
  private createCardObject(card: CardData): Phaser.GameObjects.Container {
    // Image
    this.cardImage = this.scene.add.image(0, 0, card.assetKey)
    const cardContainer = this.scene.add
      .container(0, 0, this.cardImage)
      .setSize(this.cardImage.width, this.cardImage.height) // 270, 383
    this.cardImage.setPosition(this.cardImage.width / 2, this.cardImage.height / 2)

    // Cost
    this.cardCostText = this.scene.add.text(
      CARD_COST_POSITION.x,
      CARD_COST_POSITION.y,
      String(card.cost),
      CARD_NUMBER_FONT_STYLE
    )
    // Attack
    this.cardAttackText = this.scene.add.text(
      CARD_ATTACK_POSITION.x,
      CARD_ATTACK_POSITION.y,
      String(card.attack),
      CARD_NUMBER_FONT_STYLE
    )
    // Health
    this.cardHealthText = this.scene.add.text(
      CARD_HEALTH_POSITION.x,
      CARD_HEALTH_POSITION.y,
      String(card.health),
      CARD_NUMBER_FONT_STYLE
    )
    // Name
    this.cardNameText = this.scene.add
      .text(
        this.cardImage.x,
        CARD_NAME_POSITION.y,
        card.name,
        card.name.length < 10 ? CARD_NAME_FONT_STYLE_BIG : CARD_NAME_FONT_STYLE_SMALL
      )
      .setOrigin(0.5)

    console.log(`Cost: {x:${this.cardCostText.x} y:${this.cardCostText.y}}`)
    console.log(`Attack: {x:${this.cardAttackText.x} y:${this.cardAttackText.y}}`)
    console.log(`Health: {x:${this.cardHealthText.x} y:${this.cardHealthText.y}}`)
    console.log(`Name: {x:${this.cardNameText.x} y:${this.cardNameText.y}}`)

    cardContainer.add([this.cardCostText, this.cardAttackText, this.cardHealthText, this.cardNameText])
    return cardContainer
  }
}
