import { CARD_ASSETS_KEYS, DATA_ASSET_KEYS } from '../assets/asset-keys'
import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'

export class PreloadScene extends BaseScene {
  constructor() {
    super({
      key: SCENE_KEYS.PRELOAD_SCENE,
    })
  }

  preload() {
    const cardAssetsPath: string = 'assets/images/cards'

    // Card Assets
    this.load.image(CARD_ASSETS_KEYS.SNOWFLIPPER_PENGUIN, `${cardAssetsPath}/Snowflipper-Penguin.png`)

    // JSON Data
    this.load.json(DATA_ASSET_KEYS.CARDS, 'assets/data/cards.json')
  }

  create() {
    this.scene.start(SCENE_KEYS.GAME_SCENE)
  }
}
