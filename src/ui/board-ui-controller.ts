import { Card } from '../gameObjects/card'
import { BoardBackground } from './board-background'
import { PlayerHandUI } from './hand/player-hand-ui'
import { OpponentHandUI } from './hand/opponent-hand-ui'
import { BoardUI } from './board/board-ui'
import { PlayerPreviewUI } from './preview/player-preview-ui'
import { PlayerBoardUI } from './board/player-board-ui'
import { OpponentBoardUI } from './board/opponent-board-ui'
import { OpponentPreviewUI } from './preview/opponent-preview-ui'

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
  private playerPreviewUI: PlayerPreviewUI
  private opponentPreviewUI: OpponentPreviewUI
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
    this.playerPreviewUI = new PlayerPreviewUI(this.scene)
    this.playerPreviewUI.hideCardContainer()

    this.opponentPreviewUI = new OpponentPreviewUI(this.scene)
    // this.opponentPreviewUI.hideCardContainer()
  }

  private createHandUI(): void {
    this.playerHandUI = new PlayerHandUI(this.scene, this.playerPreviewUI, this.onPlayCallback)
    this.opponentHandUI = new OpponentHandUI(this.scene, this.onPlayCallback)
  }

  private createBoardUI(): void {
    this.playerBoardUI = new PlayerBoardUI(this.scene, this.playerPreviewUI)
    this.opponentBoardUI = new OpponentBoardUI(this.scene, this.playerPreviewUI)
  }
}
