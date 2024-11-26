import { Card } from '../gameObjects/card'
import { BoardBackground } from './board-background'
import { HandUI } from './hand-ui'
import { PlayerBoardUI } from './player-board-ui'
import { PreviewUI } from './preview-ui'

export const PLAYER_BOARD_BOUNDS = Object.freeze({
  startX: 449,
  endX: 1599,
  startY: 487,
  endY: 637,
})

export class BoardUI {
  public handUI: HandUI
  public playerBoardUI: PlayerBoardUI
  private scene: Phaser.Scene
  private previewUI: PreviewUI
  private onPlayCallback: (card: Card) => void

  constructor(scene: Phaser.Scene, onPlayCallback: (card: Card) => void) {
    this.scene = scene
    this.onPlayCallback = onPlayCallback

    this.createBoardBackground()
    this.createPreviewUI() // Needs to come before createHandUI()
    this.createHandUI()
    this.createPlayerBoardUI()
  }

  private createBoardBackground(): void {
    new BoardBackground(this.scene)
  }

  private createPreviewUI(): void {
    this.previewUI = new PreviewUI(this.scene)
    this.previewUI.hideCardContainer()
  }

  private createHandUI(): void {
    this.handUI = new HandUI(this.scene, this.previewUI, this.onPlayCallback)
  }

  private createPlayerBoardUI(): void {
    this.playerBoardUI = new PlayerBoardUI(this.scene, this.previewUI)
  }
}
