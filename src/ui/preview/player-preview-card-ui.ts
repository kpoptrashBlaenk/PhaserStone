import { Card } from '../../gameObjects/card'
import { PreviewCardUI } from './preview-card-ui'

const PREVIEW_CARD_PADDING = 20

export class PlayerPreviewCardUI extends PreviewCardUI {
  constructor(scene: Phaser.Scene, card: Card) {
    super(scene, card)
  }

  protected setPosition(): void {
    this.cardContainer.setPosition(
      this.scene.scale.width - this.cardContainer.width * this.cardContainer.scaleX - PREVIEW_CARD_PADDING,
      PREVIEW_CARD_PADDING * 2
    )
  }
}
