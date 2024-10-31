import { FONT_KEYS } from '../assets/font-keys'
import { Card } from '../gameObjects/card'
import { PreviewUI } from './preview-ui'

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
  private card: Card
  private cardImage: Phaser.GameObjects.Image
  private cardCostText: Phaser.GameObjects.Text
  private cardAttackText: Phaser.GameObjects.Text
  private cardHealthText: Phaser.GameObjects.Text
  private cardNameText: Phaser.GameObjects.Text
  // TODO: private cardEffectsText: Phaser.GameObjects.Text
  private scene: Phaser.Scene
  private previewUI: PreviewUI

  constructor(scene: Phaser.Scene, card: Card) {
    this.scene = scene
    this.card = card

    this.createCardObject(card)
  }

  // Has Preview, Scale and Hover
  public forHand(previewUI: PreviewUI): void {
    this.previewUI = previewUI

    this.cardContainer.setScale(0.18)
    this.cardContainer.setSize(
      this.cardContainer.width * this.cardContainer.scaleX,
      this.cardContainer.height * this.cardContainer.scaleY
    )

    this.cardImage.setInteractive()

    this.cardImage.on('pointerover', () => {
      previewUI.changeCardContainer(this.card)
    })

    this.cardImage.on('pointerout', () => {
      previewUI.hideCardContainer()
    })
  }

  public forPreview(): void {
    const padding = 20
    this.cardContainer.setScale(0.5)
    this.cardContainer.setPosition(
      this.scene.scale.width - this.cardContainer.width * this.cardContainer.scaleX - padding,
      padding * 2
    )
    this.cardContainer.setAlpha(0)
  }

  public modifyPreviewCardObjects(card: Card): void {
    this.cardImage.setTexture(card.assetKey)
    this.cardCostText.setText(String(card.cost))
    this.cardAttackText.setText(String(card.attack))
    this.cardHealthText.setText(String(card.health))
    this.cardNameText.setText(card.name)
    this.cardNameText.setX(this.cardImage.x + this.cardImage.width / 2 - this.cardNameText.width / 2 + 10)
    this.cardContainer.setAlpha(1)
  }

  public hidePreviewCardObject(): void {
    this.cardContainer.setAlpha(0)
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
