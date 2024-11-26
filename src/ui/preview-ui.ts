import { CARD_ASSETS_KEYS } from '../assets/asset-keys'
import { Card } from '../gameObjects/card'
import { CLASS_KEYS, TYPE_KEYS } from '../gameObjects/card-keys'
import { PreviewCardUI } from './card/preview-card-ui'

export class PreviewUI {
  private card: Card
  private cardUI: PreviewCardUI
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene

    const cardData = {
      assetKey: CARD_ASSETS_KEYS.TEMPLATE,
      attack: 0,
      cardClass: CLASS_KEYS.NEUTRAL,
      cost: 0,
      health: 0,
      id: 0,
      name: 'Preview',
      type: TYPE_KEYS.MINION,
    }
    this.card = new Card(cardData) // No null cases allowed, so init with an empty card that hides immediately

    this.cardUI = new PreviewCardUI(this.scene, this.card)
  }

  public changeCardContainer(card: Card) {
    this.card = card
    this.cardUI.modifyPreviewCardObjects(this.card)
  }

  public hideCardContainer(): void {
    this.cardUI.hidePreviewCardObject()
  }
}
