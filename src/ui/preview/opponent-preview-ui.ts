import { OpponentPreviewCardUI } from './opponent-preview-card-ui'
import { PreviewUI } from './preview-ui'

export class OpponentPreviewUI extends PreviewUI {
  constructor(scene: Phaser.Scene) {
    super(scene)

    this.cardUI = new OpponentPreviewCardUI(this.scene, this.card)
  }
}
