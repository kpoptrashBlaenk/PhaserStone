import { BoardBackground } from './board-background'
import { HandUI } from './hand-ui'
import { PreviewUI } from './preview-ui'

export class BoardUI {
  public handUI: HandUI
  private scene: Phaser.Scene
  private previewUI: PreviewUI

  constructor(scene: Phaser.Scene) {
    this.scene = scene

    this.createBoardBackground()
    this.createPreviewUI() // Needs to come before createHandUI()
    this.createHandUI()
  }

  private createBoardBackground(): void {
    new BoardBackground(this.scene)
  }

  private createHandUI(): void {
    this.handUI = new HandUI(this.scene, this.previewUI)
  }

  private createPreviewUI(): void {
    this.previewUI = new PreviewUI(this.scene)
  }
}
