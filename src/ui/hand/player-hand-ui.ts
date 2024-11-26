import { Card } from '../../gameObjects/card'
import { PlayerHandCardUI } from '../card/player-hand-card-ui'
import { PreviewUI } from '../preview/preview-ui'
import { BaseHandUI } from './hand-ui'

export class PlayerHandUI extends BaseHandUI {
  private previewUI: PreviewUI

  constructor(scene: Phaser.Scene, previewUI: PreviewUI, onPlayCallback: (card: Card) => void) {
    super(scene, onPlayCallback)

    this.previewUI = previewUI
  }

  public drawCard(card: Card): void {
    const cardContainer = new PlayerHandCardUI(this.scene, card, this.previewUI, this.onPlayCallback)
    this.handContainer.add(cardContainer.cardContainer)
    cardContainer.cardContainer.setData('handCardUI', cardContainer)
    this.resizeHandContainer()
  }

  protected setPosition(): void {
    this.handContainer.setPosition(
      this.scene.scale.width / 2 - this.handContainer.width / 2,
      this.scene.scale.height - this.handContainer.height
    )
  }
}
