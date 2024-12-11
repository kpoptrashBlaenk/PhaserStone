import { checkStats } from '../../common/check-stats'
import { BattleScene } from '../../scenes/battle-scene'
import { TargetKeys } from '../../utils/keys'
import {
  CARD_ATTACK_POSITION,
  CARD_COST_POSITION,
  CARD_HEALTH_POSITION,
  CARD_NAME_FONT_STYLE_BIG,
  CARD_NAME_FONT_STYLE_SMALL,
  CARD_NAME_POSITION,
  CARD_NUMBER_FONT_STYLE,
} from '../../utils/visual-configs'
import { CardData } from './card-keys'

export class Card {
  protected originalCard: CardData
  protected card: CardData
  protected owner: TargetKeys
  protected scene: BattleScene
  protected cardContainer: Phaser.GameObjects.Container
  protected cardImage: Phaser.GameObjects.Image
  protected cardCostText: Phaser.GameObjects.Text
  protected cardAttackText: Phaser.GameObjects.Text
  protected cardHealthText: Phaser.GameObjects.Text
  protected cardNameText: Phaser.GameObjects.Text

  constructor(scene: BattleScene, card: CardData, owner: TargetKeys) {
    this.scene = scene
    this.owner = owner
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
    checkStats(this.card.attack, this.originalCard.attack, this.cardAttackText)
    checkStats(this.card.health, this.originalCard.health, this.cardHealthText)
    checkStats(this.card.cost, this.originalCard.cost, this.cardCostText)
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

    cardContainer.add([this.cardCostText, this.cardAttackText, this.cardHealthText, this.cardNameText])
    return cardContainer
  }
}
