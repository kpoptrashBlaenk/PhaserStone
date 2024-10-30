import { CARD_ASSETS_KEYS, DATA_ASSET_KEYS, UI_ASSET_KEYS } from '../assets/asset-keys'
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
    const boardAssetsPath: string = 'assets/images/boards'

    // Board Assets
    this.load.image(UI_ASSET_KEYS.BOARD, `${boardAssetsPath}/board.webp`)

    // Card Assets
    this.load.image(CARD_ASSETS_KEYS.TEMPLATE, `${cardAssetsPath}/card-template.png`)

    // JSON Data
    this.load.json(DATA_ASSET_KEYS.CARDS, 'assets/data/cards.json')
  }

  create() {
    this.scene.start(SCENE_KEYS.BATTLE_SCENE)
  }
}
