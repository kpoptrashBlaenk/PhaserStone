import { BoardBackground } from './board-background'
import { HandUI } from './hand-ui'
import { PreviewUI } from './preview-ui'

export const PLAYER_BOARD_BOUNDS = Object.freeze({
  startX: 449,
  endX: 1599,
  startY: 487,
  endY: 637,
})

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
    this.previewUI.hideCardContainer()
  }
}
