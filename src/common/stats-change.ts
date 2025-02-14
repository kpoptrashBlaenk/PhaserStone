import { CARD_CONFIG } from '../utils/visual-configs'

/**
 * Set stat color to white(equal), green(greater) or red(lower)
 * 
 * @param current Current stat
 * @param original Original stat
 * @param textObject Text object to color
 */
export function colorStat(current: number, original: number, textObject: Phaser.GameObjects.Text): void {
  if (textObject) {
    textObject.setText(String(current))

    if (current > original) {
      textObject.setColor(CARD_CONFIG.COLOR.GREEN)
    } else if (current < original) {
      textObject.setColor(CARD_CONFIG.COLOR.RED)
    } else {
      textObject.setColor(CARD_CONFIG.COLOR.WHITE)
    }
  }
}
