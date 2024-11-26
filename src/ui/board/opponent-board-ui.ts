import { PlayerPreviewUI } from '../preview/player-preview-ui'
import { BOARD_PADDING } from './board-constants'
import { BoardUI } from './board-ui'

export class OpponentBoardUI extends BoardUI {
  constructor(scene: Phaser.Scene, previewUI: PlayerPreviewUI) {
    super(scene, previewUI)
  }

  protected setPosition(): void {
    const { x, y } = this.calculatePosition(BOARD_PADDING.OPPONENT - this.boardContainer.height)
    this.boardContainer.setPosition(x, y)
  }
}
