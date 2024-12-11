import { CARD_TEXT_COLOR } from '../utils/visual-configs'

export function checkStats(current: number, original: number, textObject: Phaser.GameObjects.Text): void {
  textObject.setText(String(current))

  if (current > original) {
    textObject.setColor(CARD_TEXT_COLOR.RED)
  } else if (current < original) {
    textObject.setColor(CARD_TEXT_COLOR.GREEN)
  } else {
    textObject.setColor(CARD_TEXT_COLOR.WHITE)
  }
}
