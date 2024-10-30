import { BoardBackground } from './board-background'
import { HandUI } from './hand-ui'

export class BoardUI {
  private scene: Phaser.Scene
  public handUI: HandUI

  constructor(scene: Phaser.Scene) {
    this.scene = scene

    this.createBoardBackground()
    this.createHandUI()
  }

  private createBoardBackground(): void {
    new BoardBackground(this.scene)
  }

  private createHandUI(): void {
    this.handUI = new HandUI(this.scene)
  }
}
