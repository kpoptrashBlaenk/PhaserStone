import { PlayerPreviewCardUI } from './player-preview-card-ui'
import { PreviewUI } from './preview-ui'

export class PlayerPreviewUI extends PreviewUI {
  constructor(scene: Phaser.Scene) {
    super(scene)

    this.cardUI = new PlayerPreviewCardUI(this.scene, this.card)
  }
}
