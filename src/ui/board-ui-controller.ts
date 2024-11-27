import { Card } from '../gameObjects/card'
import { BoardBackground } from './board-background'
import { BoardUI } from './board/board-ui'
import { TARGETS_KEYS } from '../event-keys'
import { PreviewUI } from './preview/preview-ui'
import { HandUI } from './hand/hand-ui'

export const PLAYER_BOARD_BOUNDS = Object.freeze({
  startX: 449,
  endX: 1599,
  startY: 487,
  endY: 637,
})

export class BoardUIController {
  public playerHandUI: HandUI
  public opponentHandUI: HandUI
  public playerBoardUI: BoardUI
  public opponentBoardUI: BoardUI
  private scene: Phaser.Scene
  private playerPreviewUI: PreviewUI
  private opponentPreviewUI: PreviewUI
  private onPlayCallback: (card: Card) => void
  private emitter: Phaser.Events.EventEmitter

  constructor(
    scene: Phaser.Scene,
    onPlayCallback: (card: Card) => void,
    emitter: Phaser.Events.EventEmitter
  ) {
    this.scene = scene
    this.emitter = emitter
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
    this.playerPreviewUI = new PreviewUI(this.scene, TARGETS_KEYS.PLAYER, this.scene.events)
    this.opponentPreviewUI = new PreviewUI(this.scene, TARGETS_KEYS.OPPONENT, this.scene.events)
  }

  private createHandUI(): void {
    this.playerHandUI = new HandUI(
      this.scene,
      this.playerPreviewUI,
      this.onPlayCallback,
      TARGETS_KEYS.PLAYER,
      this.scene.events
    )
    this.opponentHandUI = new HandUI(
      this.scene,
      this.playerPreviewUI,
      this.onPlayCallback,
      TARGETS_KEYS.OPPONENT,
      this.scene.events
    )
  }

  private createBoardUI(): void {
    this.playerBoardUI = new BoardUI(this.scene, this.playerPreviewUI, TARGETS_KEYS.PLAYER, this.emitter)
    this.opponentBoardUI = new BoardUI(this.scene, this.playerPreviewUI, TARGETS_KEYS.OPPONENT, this.emitter)
  }
}
