import Phaser from 'phaser'
import { FONT_KEYS } from '../../../src/assets/font-keys'
import { BattleScene } from '../scenes/battle-scene'
import { WarningKeys } from '../../../src/utils/keys'

export class WarnMessage {
  private scene: Phaser.Scene
  private warnMessage: Phaser.GameObjects.Text
  private isPlaying: boolean

  constructor(scene: BattleScene) {
    this.scene = scene
    this.isPlaying = false

    this.warnMessage = this.createTurnMessage()
  }

  /**
   * Show Warn Message
   */
  public showTurnMessage(text: WarningKeys): void {
    if (this.isPlaying) {
      return
    }

    this.warnMessage.setText(text)
    this.isPlaying = true // To avoid spam

    this.scene.tweens.add({
      targets: this.warnMessage,
      alpha: 1,
      duration: 200,
      onComplete: () => {
        this.scene.tweens.add({
          targets: this.warnMessage,
          x: '+=10',
          duration: 50,
          yoyo: true,
          repeat: 5,
          onComplete: () => {
            this.scene.tweens.add({
              targets: this.warnMessage,
              alpha: 0,
              duration: 400,
              onComplete: () => {
                this.isPlaying = false
              },
            })
          },
        })
      },
    })
  }

  /**
   * Create Your Turn Message
   */
  private createTurnMessage(): Phaser.GameObjects.Text {
    return this.scene.add
      .text(this.scene.scale.width / 2, this.scene.scale.height / 2, '', {
        fontFamily: FONT_KEYS.HEARTHSTONE,
        fontSize: '48px',
        color: '#FF4500',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center',
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: '#000000',
          blur: 4,
          fill: true,
        },
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(10)
  }
}
