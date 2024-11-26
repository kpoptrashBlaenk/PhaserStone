import { Card } from '../gameObjects/card'
import { BoardBackground } from './board-background'
import { PlayerHandUI } from './hand/player-hand-ui'
import { OpponentHandUI } from './hand/opponent-hand-ui'
import { BoardUI } from './board/board-ui'
import { PreviewUI } from './preview/preview-ui'
import { PlayerBoardUI } from './board/player-board-ui'
import { OpponentBoardUI } from './board/opponent-board-ui'

export const PLAYER_BOARD_BOUNDS = Object.freeze({
  startX: 449,
  endX: 1599,
  startY: 487,
  endY: 637,
})

export class BoardUIController {
  public playerHandUI: PlayerHandUI
  public opponentHandUI: OpponentHandUI
  public playerBoardUI: BoardUI
  public opponentBoardUI: BoardUI
  private scene: Phaser.Scene
  private previewUI: PreviewUI
  private onPlayCallback: (card: Card) => void

  constructor(scene: Phaser.Scene, onPlayCallback: (card: Card) => void) {
    this.scene = scene
    this.onPlayCallback = onPlayCallback

    this.createBoardBackground()
    this.createPreviewUI() // Needs to come before createHandUI()
    this.createHandUI()
    this.createBoardUI()
  }

  private createBoardBackground(): void {
    new BoardBackground(this.scene)
  }

  private createPreviewUI(): void {
    this.previewUI = new PreviewUI(this.scene)
    this.previewUI.hideCardContainer()
  }

  private createHandUI(): void {
    this.playerHandUI = new PlayerHandUI(this.scene, this.previewUI, this.onPlayCallback)
    this.opponentHandUI = new OpponentHandUI(this.scene, this.onPlayCallback)
  }

  private createBoardUI(): void {
    this.playerBoardUI = new PlayerBoardUI(this.scene, this.previewUI)
    this.opponentBoardUI = new OpponentBoardUI(this.scene, this.previewUI)
  }
}
