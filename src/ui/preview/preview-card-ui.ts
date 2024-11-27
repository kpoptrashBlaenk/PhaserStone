import { TargetKeys, TARGETS_KEYS } from '../../utils/event-keys'
import { Card } from '../../gameObjects/card'
import { CardUI } from '../card/card-ui'

const CARD_NAME_PADDING_X = 10
const PREVIEW_CARD_PADDING = 20

export class PreviewCardUI extends CardUI {
  private owner: TargetKeys
  private emitter: Phaser.Events.EventEmitter

  constructor(scene: Phaser.Scene, card: Card, owner: TargetKeys, emitter: Phaser.Events.EventEmitter) {
    super(scene, card)
    this.owner = owner
    this.emitter = emitter

    this.forPreview()
    this.setPosition()
  }

  private setPosition(): void {
    if (this.owner === TARGETS_KEYS.PLAYER) {
      this.cardContainer.setPosition(
        this.scene.scale.width - this.cardContainer.width * this.cardContainer.scaleX - PREVIEW_CARD_PADDING,
        PREVIEW_CARD_PADDING * 2
      )
    } else {
      this.cardContainer.setPosition(PREVIEW_CARD_PADDING, PREVIEW_CARD_PADDING * 2)
    }
  }

  private forPreview(): void {
    this.cardContainer.setScale(1)
    this.cardContainer.setAlpha(0)
  }

  public modifyPreviewCardObjects(card: Card): void {
    this.cardImage.setTexture(card.assetKey)
    this.cardCostText.setText(String(card.cost))
    this.cardAttackText.setText(String(card.attack))
    this.cardHealthText.setText(String(card.health))
    this.cardNameText.setText(card.name)
    this.cardNameText.setX(
      this.cardImage.x + this.cardImage.width / 2 - this.cardNameText.width / 2 + CARD_NAME_PADDING_X
    )
    this.cardContainer.setAlpha(1)
  }

  public hidePreviewCardObject(): void {
    this.cardContainer.setAlpha(0)
  }
}
