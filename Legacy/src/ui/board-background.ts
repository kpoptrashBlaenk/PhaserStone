import Phaser from 'phaser'
import { UI_ASSET_KEYS } from '../../../src/assets/asset-keys'

export class Background {
  private scene: Phaser.Scene
  private background: Phaser.GameObjects.Image

  constructor(scene: Phaser.Scene) {
    this.scene = scene

    this.background = this.scene.add
      .image(0, 0, UI_ASSET_KEYS.BOARD)
      .setOrigin(0)
      .setAlpha(0)
      .setScale(2)
    this.background.setY(0).setAlpha(1)
  }
}
