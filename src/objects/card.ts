import { CARD_ASSETS_KEYS, CardAssetKeys } from '../assets/asset-keys'
import { CardData } from '../utils/card-keys'
import { TargetKeys } from '../utils/keys'
import { CARD_CONFIG } from '../utils/visual-configs'

export class Card {
  private $scene: Phaser.Scene
  private $cardData: CardData
  private $originalData: CardData
  private $owner: TargetKeys
  private $cardContainer: Phaser.GameObjects.Container
  private $cardTemplateImage: Phaser.GameObjects.Image
  private $cardPortraitImage: Phaser.GameObjects.Image
  private $cardNameText: Phaser.GameObjects.Text
  private $cardCostText: Phaser.GameObjects.Text
  private $cardAttackText: Phaser.GameObjects.Text
  private $cardHealthText: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene, cardData: CardData, owner: TargetKeys) {
    this.$scene = scene
    this.$cardData = Object.assign({}, cardData)
    this.$originalData = Object.freeze({ ...cardData })
    this.$owner = owner

    this.$createCard()
    this.$resizeCard()
  }

  public get container(): Phaser.GameObjects.Container {
    return this.$cardContainer
  }

  /**
   * Show front or back
   */
  public setSide(side: 'FRONT' | 'BACK'): void {
    if (side === 'FRONT') {
      this.$cardCostText.setAlpha(1)
      this.$cardAttackText.setAlpha(1)
      this.$cardHealthText.setAlpha(1)
      this.$cardNameText.setAlpha(1)
      this.$cardTemplateImage.setAlpha(1)
      this.$cardPortraitImage.setScale(CARD_CONFIG.SIZE.PORTRAIT_SCALE)
    }

    this.$cardPortraitImage.setTexture(CARD_ASSETS_KEYS.CARD_BACK)
    this.$cardCostText.setAlpha(0)
    this.$cardAttackText.setAlpha(0)
    this.$cardHealthText.setAlpha(0)
    this.$cardNameText.setAlpha(0)
    this.$cardTemplateImage.setAlpha(0)
    this.$cardPortraitImage.setScale(1)
  }

  /**
   * Creates card objects
   */
  private $createCard(): void {
    // Image
    this.$cardTemplateImage = this.$scene.add.image(0, 0, CARD_ASSETS_KEYS.TEMPLATE)
    this.$cardTemplateImage.setPosition(this.$cardTemplateImage.width / 2, this.$cardTemplateImage.height / 2)

    this.$cardPortraitImage = this.$scene.add
      .image(0, 0, this.$cardData.assetKey)
      .setSize(this.$cardTemplateImage.width / 2, this.$cardTemplateImage.height / 2)
      .setDepth(-1)
      .setScale(CARD_CONFIG.SIZE.PORTRAIT_SCALE)

    // Cost
    this.$cardCostText = this.$scene.add.text(
      CARD_CONFIG.POSITION.COST.X,
      CARD_CONFIG.POSITION.COST.Y,
      String(this.$cardData.cost),
      CARD_CONFIG.FONT_STYLE.NUMBER
    )

    // Attack
    this.$cardAttackText = this.$scene.add.text(
      CARD_CONFIG.POSITION.ATTACK.X,
      CARD_CONFIG.POSITION.ATTACK.Y,
      String(this.$cardData.attack),
      CARD_CONFIG.FONT_STYLE.NUMBER
    )

    // Health
    this.$cardHealthText = this.$scene.add.text(
      CARD_CONFIG.POSITION.HEALTH.X,
      CARD_CONFIG.POSITION.HEALTH.Y,
      String(this.$cardData.health),
      CARD_CONFIG.FONT_STYLE.NUMBER
    )

    // Name
    this.$cardNameText = this.$scene.add
      .text(
        this.$cardTemplateImage.x,
        CARD_CONFIG.POSITION.NAME.Y,
        this.$cardData.name,
        this.$cardData.name.length < 10 ? CARD_CONFIG.FONT_STYLE.NAME.SMALL : CARD_CONFIG.FONT_STYLE.NAME.BIG
      )
      .setOrigin(0.5)

    // Container
    this.$cardContainer = this.$scene.add
      .container(0, 0)
      .setSize(this.$cardTemplateImage.width, this.$cardTemplateImage.height) // 270, 383
    this.$cardPortraitImage.setPosition(this.$cardTemplateImage.width / 2, this.$cardTemplateImage.height / 2)

    this.$cardContainer.add([
      this.$cardPortraitImage,
      this.$cardTemplateImage,
      this.$cardCostText,
      this.$cardAttackText,
      this.$cardHealthText,
      this.$cardNameText,
    ])
  }

  /**
   * Resize card and card objects
   */
  private $resizeCard(): void {
    this.$cardContainer.setScale(CARD_CONFIG.SIZE.SCALE)
    this.$cardContainer.setSize(
      this.$cardContainer.width * this.$cardContainer.scaleX,
      this.$cardContainer.height * this.$cardContainer.scaleY
    )

    this.$cardPortraitImage.setY(this.$cardPortraitImage.height / 2)
  }
}
