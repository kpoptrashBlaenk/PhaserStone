import { FONT_KEYS } from '../assets/font-keys'
import { WarningKeys } from '../utils/keys'

/**
 * Creates warning message and animates it, then remove it
 * 
 * @param scene Current scene
 * @param key {@link WarningKeys}
 */
export function warningMessage(scene: Phaser.Scene, key: WarningKeys): void {
  // Create object
  const warningMessage = scene.add
    .text(scene.scale.width / 2, scene.scale.height / 2, key, {
      fontFamily: FONT_KEYS.HEARTHSTONE,
      fontSize: '48px',
      color: '#FF4C4C',
      stroke: '#000000',
      strokeThickness: 5,
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
    .setDepth(20)

    // Animate appearance
  scene.tweens.add({
    targets: warningMessage,
    alpha: { from: 0, to: 1 },
    scale: { from: 0.8, to: 1 },
    ease: 'Cubic.Out',
    duration: 500,
    // Animate floating
    onComplete: () => {
      scene.tweens.add({
        targets: warningMessage,
        alpha: 0,
        duration: 400,
        delay: 1000,
        // Remove
        onComplete: () => {
          warningMessage.destroy()
        },
      })
    },
  })
}
