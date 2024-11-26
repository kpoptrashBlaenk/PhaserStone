import { PreviewUI } from '../preview-ui'
import { BoardUI } from './board-ui'

export class OpponentBoardUI extends BoardUI {
  constructor(scene: Phaser.Scene, previewUI: PreviewUI) {
    super(scene, previewUI)
  }

  protected setPosition(): void {
    this.boardContainer.setPosition(
      this.scene.scale.width / 2 - this.boardContainer.width / 2,
      this.scene.scale.height / 2 - this.boardContainer.height - 40
    )
  }
}