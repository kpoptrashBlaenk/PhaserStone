import Phaser from 'phaser'
import { UI_ASSET_KEYS } from '../../../src/assets/asset-keys'

export class BoardBackground {
  private scene: Phaser.Scene
  private boardBackground: Phaser.GameObjects.Image

  constructor(scene: Phaser.Scene) {
    this.scene = scene

    this.boardBackground = this.scene.add
      .image(0, 0, UI_ASSET_KEYS.BOARD)
      .setOrigin(0)
      .setAlpha(0)
      .setScale(2)
    this.boardBackground.setY(0).setAlpha(1)
  }
}
