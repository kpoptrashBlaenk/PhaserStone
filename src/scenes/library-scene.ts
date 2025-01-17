import { DATA_ASSET_KEYS } from '../assets/asset-keys'
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
  }

  loadCards() {
    const allCards = [...this.cache.json.get(DATA_ASSET_KEYS.CARDS)]
    const availableCards = [...allCards]

    // Gotta create card base class to then derive board card and library card
  }
}
