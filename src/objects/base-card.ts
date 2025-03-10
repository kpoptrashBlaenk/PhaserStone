import BBCodeText from 'phaser3-rex-plugins/plugins/gameobjects/tagtext/bbcodetext/BBCodeText'
import { CARD_ASSETS_KEYS } from '../assets/asset-keys'
import { colorStat } from '../common/stats-change'
import { CardData } from '../utils/card-keys'
import { CARD_CONFIG } from '../utils/visual-configs'

/**
 * Base class for Cards, which includes the card's visual objects
 */
export class BaseCard {
  protected _scene: Phaser.Scene
  protected _cardData: CardData
  protected _cardContainer: Phaser.GameObjects.Container
  protected _cardAttackText: Phaser.GameObjects.Text
  protected _cardHealthText: Phaser.GameObjects.Text
  protected _cardTemplateImage: Phaser.GameObjects.Image
  protected _cardPortraitImage: Phaser.GameObjects.Image
  protected _cardNameText: Phaser.GameObjects.Text
  protected _cardCostText: Phaser.GameObjects.Text
  protected _cardBodyText: Phaser.GameObjects.Text | BBCodeText
  protected _previewContainer: Phaser.GameObjects.Container
  protected _originalData: CardData

  constructor(scene: Phaser.Scene, cardData: CardData) {
    this._scene = scene
    // Create copy of card data to not change and keep the origin
    this._cardData = { ...cardData }
    this._originalData = Object.freeze({ ...cardData })

    // Create card and resize it
    this._cardContainer = this.$createCard()
    this.$resizeCard(this._cardContainer)
  }

  /**
   * Return {@link _cardContainer}
   */
  public get container(): Phaser.GameObjects.Container {
    return this._cardContainer
  }

  /**
   * Return {@link _cardPortraitImage}
   */
  public get portrait(): Phaser.GameObjects.Image {
    return this._cardPortraitImage
  }

  /**
   * Return {@link _cardTemplateImage}
   */
  public get template(): Phaser.GameObjects.Image {
    return this._cardTemplateImage
  }

  /**
   * Return the card's modifiable {@link _cardData}
   */
  public get card(): CardData {
    return this._cardData
  }

  /**
   * Set card's shown side, to remove/add {@link $createHover()}, etc.
   *
   * @param side Front or backside
   */
  public setSide(side: 'FRONT' | 'BACK'): void {
    // Front side makes all objects visible and adds hover
    if (side === 'FRONT') {
      this._cardPortraitImage.setTexture(this._cardData.assetKey)
      this._cardCostText.setAlpha(1)
      this._cardAttackText.setAlpha(1)
      this._cardHealthText.setAlpha(1)
      this._cardNameText.setAlpha(1)
      this._cardBodyText.setAlpha(1)
      this._cardTemplateImage.setAlpha(1)
      this._cardPortraitImage.setScale(CARD_CONFIG.SIZE.PORTRAIT_SCALE)
      this._cardPortraitImage.setY(this._cardTemplateImage.height / CARD_CONFIG.SIZE.PORTRAIT_Y_DIVIDER)
      this._cardTemplateImage.setInteractive({
        cursor: 'pointer',
      })
      this.$createHover()
      return
    }

    /**
     * Back side makes all objects invisible and removes hover
     */
    this._cardPortraitImage.setTexture(CARD_ASSETS_KEYS.CARD_BACK)
    this._cardCostText.setAlpha(0)
    this._cardAttackText.setAlpha(0)
    this._cardHealthText.setAlpha(0)
    this._cardNameText.setAlpha(0)
    this._cardBodyText.setAlpha(0)
    this._cardTemplateImage.setAlpha(0)
    this._cardPortraitImage.setScale(1)
  }

  /**
   * Create {@link _cardTemplateImage}, {@link _cardPortraitImage}, {@link _cardCostText}, {@link _cardAttackText},
   * {@link _cardHealthText}, {@link _cardNameText}, {@link _cardNameText} then place them into {@link _cardContainer}
   */
  private $createCard(): Phaser.GameObjects.Container {
    // Image
    this._cardTemplateImage = this._scene.add.image(0, 0, CARD_ASSETS_KEYS.TEMPLATE)
    this._cardTemplateImage.setPosition(this._cardTemplateImage.width / 2, this._cardTemplateImage.height / 2)

    this._cardPortraitImage = this._scene.add
      .image(0, 0, this._cardData.assetKey)
      .setSize(this._cardTemplateImage.width / 2, this._cardTemplateImage.height / 2)
      .setDepth(-1)
      .setScale(CARD_CONFIG.SIZE.PORTRAIT_SCALE)

    // Cost
    this._cardCostText = this._scene.add.text(
      CARD_CONFIG.POSITION.COST.X,
      CARD_CONFIG.POSITION.COST.Y,
      String(this._cardData.cost),
      CARD_CONFIG.FONT_STYLE.NUMBER
    )

    // Attack
    this._cardAttackText = this._scene.add.text(
      CARD_CONFIG.POSITION.ATTACK.X,
      CARD_CONFIG.POSITION.ATTACK.Y,
      String(this._cardData.attack),
      CARD_CONFIG.FONT_STYLE.NUMBER
    )

    // Health
    this._cardHealthText = this._scene.add.text(
      CARD_CONFIG.POSITION.HEALTH.X,
      CARD_CONFIG.POSITION.HEALTH.Y,
      String(this._cardData.health),
      CARD_CONFIG.FONT_STYLE.NUMBER
    )

    // Name
    this._cardNameText = this._scene.add
      .text(
        this._cardTemplateImage.x,
        CARD_CONFIG.POSITION.NAME.Y,
        this._cardData.name,
        this._cardData.name.length > 10 ? CARD_CONFIG.FONT_STYLE.NAME.SMALL : CARD_CONFIG.FONT_STYLE.NAME.BIG
      )
      .setOrigin(0.5)

    // Body Text
    this._cardBodyText = new BBCodeText(
      this._scene,
      CARD_CONFIG.POSITION.BODY.X,
      CARD_CONFIG.POSITION.BODY.Y,
      this._cardData.text,
      //@ts-ignore
      CARD_CONFIG.FONT_STYLE.BODY
    )

    this._cardBodyText.setX(CARD_CONFIG.POSITION.BODY.X + (185 - this._cardBodyText.getBounds().width) / 2)
    this._cardBodyText.setY(this._cardBodyText.y + (40 - this._cardBodyText.height / 2))

    // Container
    const container = this._scene.add
      .container(0, 0)
      .setSize(this._cardTemplateImage.width, this._cardTemplateImage.height)
    this._cardPortraitImage.setPosition(this._cardTemplateImage.width / 2, this._cardTemplateImage.height / 2)

    container.add([
      this._cardPortraitImage,
      this._cardTemplateImage,
      this._cardCostText,
      this._cardAttackText,
      this._cardHealthText,
      this._cardNameText,
      this._cardBodyText,
    ])
    container.add(this._cardBodyText)
    return container
  }

  /**
   * Create template image, portrait image, cost object, attack object, attack object, health object, name object, body text object
   * and places them into the container to make it bigger and place it at the right top as preview
   */
  private $createPreview(): Phaser.GameObjects.Container {
    // Image
    const template = this._scene.add.image(0, 0, CARD_ASSETS_KEYS.TEMPLATE)
    template.setPosition(template.width / 2, template.height / 2)

    const portrait = this._scene.add
      .image(0, 0, this._cardData.assetKey)
      .setSize(template.width / 2, template.height / 2)
      .setDepth(-1)
      .setScale(CARD_CONFIG.SIZE.PORTRAIT_SCALE)

    // Cost
    const cost = this._scene.add.text(
      CARD_CONFIG.POSITION.COST.X,
      CARD_CONFIG.POSITION.COST.Y,
      String(this._cardData.cost),
      CARD_CONFIG.FONT_STYLE.NUMBER
    )

    // Attack
    const attack = this._scene.add.text(
      CARD_CONFIG.POSITION.ATTACK.X,
      CARD_CONFIG.POSITION.ATTACK.Y,
      String(this._cardData.attack),
      CARD_CONFIG.FONT_STYLE.NUMBER
    )
    colorStat(this._cardData.attack, this._originalData.attack, attack)

    // Health
    const health = this._scene.add.text(
      CARD_CONFIG.POSITION.HEALTH.X,
      CARD_CONFIG.POSITION.HEALTH.Y,
      String(this._cardData.health),
      CARD_CONFIG.FONT_STYLE.NUMBER
    )
    colorStat(this._cardData.health, this._originalData.health, health)

    // Name
    const name = this._scene.add
      .text(
        template.x,
        CARD_CONFIG.POSITION.NAME.Y,
        this._cardData.name,
        this._cardData.name.length > 10 ? CARD_CONFIG.FONT_STYLE.NAME.SMALL : CARD_CONFIG.FONT_STYLE.NAME.BIG
      )
      .setOrigin(0.5)

    // Body Text
    const cardBodyText = new BBCodeText(
      this._scene,
      CARD_CONFIG.POSITION.BODY.X,
      CARD_CONFIG.POSITION.BODY.Y,
      this._cardData.text,
      //@ts-ignore
      CARD_CONFIG.FONT_STYLE.BODY
    )

    cardBodyText.setX(CARD_CONFIG.POSITION.BODY.X + (185 - cardBodyText.getBounds().width) / 2)
    cardBodyText.setY(cardBodyText.y + (40 - cardBodyText.height / 2))

    // Container
    const container = this._scene.add.container(0, 0).setSize(template.width, template.height)
    portrait.setPosition(template.width / 2, template.height / CARD_CONFIG.SIZE.PORTRAIT_Y_DIVIDER)

    container.add([portrait, template, cost, attack, health, name, cardBodyText])

    return container
  }

  /**
   * Size card size to deck/hand/board size
   *
   * @param container The card container
   */
  private $resizeCard(container: Phaser.GameObjects.Container): void {
    container.setScale(CARD_CONFIG.SIZE.SCALE)
    container.setSize(
      this._cardTemplateImage.width * container.scaleX,
      this._cardTemplateImage.height * container.scaleY
    )
  }

  /**
   * Add hover, which does {@link $createPreview()}
   */
  private $createHover(): void {
    this._cardTemplateImage.on('pointerover', () => {
      this._previewContainer = this.$createPreview()
      this.$resizeCard(this._previewContainer)
      this._previewContainer.setScale(1.5)
      const x = this._cardContainer.getBounds().x - this._cardContainer.x + 650
      this._previewContainer.setX(x)
    })

    this._cardTemplateImage.on('pointerout', () => {
      this._previewContainer.destroy()
    })
  }
}
