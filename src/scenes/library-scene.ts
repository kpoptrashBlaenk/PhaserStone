import { DATA_ASSET_KEYS } from '../assets/asset-keys'
import { LibraryCard } from '../objects/library-card'
import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'

export class LibraryScene extends BaseScene {
  constructor() {
    super({
      key: SCENE_KEYS.LIBRARY_SCENE,
    })
  }

  create() {
    super.create()

    this.$createCards()
  }

  private $createCards() {
    const library = []
    const allCards = [...this.cache.json.get(DATA_ASSET_KEYS.CARDS)]
    const availableCards = [...allCards]

    for (let i = 0; i < allCards.length; i++) {
      const card = new LibraryCard(this, availableCards[0])
      library.push(card)
      card.setSide('FRONT')
    }
  }
}
