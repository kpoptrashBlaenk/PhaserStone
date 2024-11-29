import { CARD_ASSETS_KEYS } from '../assets/asset-keys'
import { TargetKeys } from '../utils/keys'
import { CLASS_KEYS, TYPE_KEYS } from './card/card-keys'
import { PreviewCard } from './card/preview-card'

export class Preview {
  private scene: Phaser.Scene
  private owner: TargetKeys
  private card: PreviewCard

  constructor(scene: Phaser.Scene, owner: TargetKeys) {
    this.scene = scene
    this.owner = owner

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
    this.card = new PreviewCard(this.scene, cardData, this.owner)
    this.card.hideCard()
  }
}
