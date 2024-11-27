import { Card } from '../gameObjects/card'
import { BoardBackground } from './board-background'
import { BoardUI } from './board-ui'
import { TARGETS_KEYS } from '../utils/event-keys'
import { PreviewUI } from './preview/preview-ui'
import { HandUI } from './hand-ui'

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
  public endTurnButton: Phaser.GameObjects.Rectangle
  private scene: Phaser.Scene
  private playerPreviewUI: PreviewUI
  private opponentPreviewUI: PreviewUI
  private emitter: Phaser.Events.EventEmitter

  constructor(scene: Phaser.Scene, emitter: Phaser.Events.EventEmitter) {
    this.scene = scene
    this.emitter = emitter

    this.createBoardBackground()
    this.createPreviewUI() // Needs to come before createHandUI()
    this.createHandUI()
    this.createBoardUI()
    this.createEndTurnButton()
  }

  /**
   * Create Background
   */
  private createBoardBackground(): void {
    new BoardBackground(this.scene)
  }

  /**
   * Create PreviewUI for when opponent plays and for default
   */
  private createPreviewUI(): void {
    this.playerPreviewUI = new PreviewUI(this.scene, TARGETS_KEYS.PLAYER, this.scene.events)
    this.opponentPreviewUI = new PreviewUI(this.scene, TARGETS_KEYS.OPPONENT, this.scene.events)
  }

  /**
   * Create HandUIs
   */
  private createHandUI(): void {
    this.playerHandUI = new HandUI(this.scene, this.playerPreviewUI, TARGETS_KEYS.PLAYER, this.scene.events)
    this.opponentHandUI = new HandUI(
      this.scene,
      this.playerPreviewUI,
      TARGETS_KEYS.OPPONENT,
      this.scene.events
    )
  }

  /**
   * Create BoardUIs
   */
  private createBoardUI(): void {
    this.playerBoardUI = new BoardUI(this.scene, this.playerPreviewUI, TARGETS_KEYS.PLAYER, this.emitter)
    this.opponentBoardUI = new BoardUI(this.scene, this.playerPreviewUI, TARGETS_KEYS.OPPONENT, this.emitter)
  }

  /**
   * Create BoardUIs
   */
  private createEndTurnButton(): void {
    this.endTurnButton = this.scene.add
      .rectangle(1600, this.scene.scale.height / 2 - 100 / 2, 200, 100, 0xff0000)
      .setInteractive()
  }
}
