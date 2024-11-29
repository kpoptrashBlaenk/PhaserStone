import { CardData, Context, CONTEXT_KEYS } from './card-keys'
import { CardUI } from './card-ui'

export class Card {
  private scene: Phaser.Scene
  private cardData: CardData
  private cardUI: CardUI

  constructor(scene: Phaser.Scene, cardData: CardData, context: Context) {
    this.scene = scene
    this.cardData = cardData

    if (context === CONTEXT_KEYS.HAND) {
      this.cardUI = new CardUI(this.scene, this.cardData)
    }
  }
}
