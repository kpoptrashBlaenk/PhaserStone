import { CARD_CONFIG } from '../utils/visual-configs'

export function colorStat(current: number, original: number, textObject: Phaser.GameObjects.Text): void {
  textObject.setText(String(current))

  if (current > original) {
    textObject.setColor(CARD_CONFIG.COLOR.GREEN)
  } else if (current < original) {
    textObject.setColor(CARD_CONFIG.COLOR.RED)
  } else {
    textObject.setColor(CARD_CONFIG.COLOR.WHITE)
  }
}
