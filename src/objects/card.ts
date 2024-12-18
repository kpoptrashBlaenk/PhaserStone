import { CARD_ASSETS_KEYS } from '../assets/asset-keys'
import { setOutline } from '../common/outline'
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
  private $previewContainer: Phaser.GameObjects.Container
  private $playable: boolean

  constructor(scene: Phaser.Scene, cardData: CardData, owner: TargetKeys) {
    this.$scene = scene
    this.$cardData = Object.freeze({ ...cardData })
    this.$originalData = Object.freeze({ ...cardData })
    this.$owner = owner
    this.$playable = false

    this.$cardContainer = this.$createCard()
    this.$resizeCard(this.$cardContainer)
  }

  public get container(): Phaser.GameObjects.Container {
    return this.$cardContainer
  }

  public get card(): CardData {
    return this.$cardData
  }

  public setPlayable(playable: boolean): void {
    this.$playable = playable
    setOutline(this.$scene, playable, this.$cardTemplateImage)
  }

  /**
   * Show front or back
   */
  public setSide(side: 'FRONT' | 'BACK'): void {
    if (side === 'FRONT') {
      this.$cardPortraitImage.setTexture(this.$cardData.assetKey)
      this.$cardCostText.setAlpha(1)
      this.$cardAttackText.setAlpha(1)
      this.$cardHealthText.setAlpha(1)
      this.$cardNameText.setAlpha(1)
      this.$cardTemplateImage.setAlpha(1)
      this.$cardPortraitImage.setScale(CARD_CONFIG.SIZE.PORTRAIT_SCALE)
      this.$cardPortraitImage.setY(this.$cardTemplateImage.height / 3.3)
      this.$cardTemplateImage.setInteractive({
        cursor: 'pointer',
      })
      this.$createHover()
      return
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
  private $createCard(): Phaser.GameObjects.Container {
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
    const container = this.$scene.add
      .container(0, 0)
      .setSize(this.$cardTemplateImage.width, this.$cardTemplateImage.height)
    this.$cardPortraitImage.setPosition(this.$cardTemplateImage.width / 2, this.$cardTemplateImage.height / 2)

    container.add([
      this.$cardPortraitImage,
      this.$cardTemplateImage,
      this.$cardCostText,
      this.$cardAttackText,
      this.$cardHealthText,
      this.$cardNameText,
    ])

    return container
  }

  /**
   * Resize card and card objects
   */
  private $resizeCard(container: Phaser.GameObjects.Container): void {
    container.setScale(CARD_CONFIG.SIZE.SCALE)
    container.setSize(
      this.$cardTemplateImage.width * container.scaleX,
      this.$cardTemplateImage.height * container.scaleY
    )
  }

  /**
   * Pointerover: Create preview to right top
   * Pointerout: Destroy hover
   */
  private $createHover(): void {
    this.$cardTemplateImage.on('pointerover', () => {
      this.$previewContainer = this.$createCard()
      this.$resizeCard(this.$previewContainer)
      this.$previewContainer.setScale(1.5)
      const x = this.$cardContainer.getBounds().x - this.$cardContainer.x + 650
      this.$previewContainer.setX(x)
    })

    this.$cardTemplateImage.on('pointerout', () => {
      this.$previewContainer.destroy()
    })
  }
}
