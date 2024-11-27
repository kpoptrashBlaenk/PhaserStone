import { CARD_ASSETS_KEYS } from '../../assets/asset-keys'
import { TargetKeys } from '../../utils/event-keys'
import { Card } from '../../gameObjects/card'
import { CLASS_KEYS, TYPE_KEYS } from '../../gameObjects/card-keys'
import { PreviewCardUI } from './preview-card-ui'

export class PreviewUI {
  private card: Card
  private cardUI: PreviewCardUI
  private scene: Phaser.Scene
  private owner: TargetKeys
  private emitter: Phaser.Events.EventEmitter

  constructor(scene: Phaser.Scene, owner: TargetKeys, emitter: Phaser.Events.EventEmitter) {
    this.scene = scene
    this.owner = owner
    this.emitter = emitter

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

    this.cardUI = new PreviewCardUI(this.scene, this.card, this.owner, this.emitter)
  }

  /**
   * Change the card in PreviewUI
   */
  public changeCardContainer(card: Card) {
    this.card = card
    this.cardUI.modifyPreviewCardObjects(this.card)
  }

  /**
   * Hide PreviewUI
   */
  public hideCardContainer(): void {
    this.cardUI.hidePreviewCardObject()
  }
}
