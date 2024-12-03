import { CARD_ASSETS_KEYS, DATA_ASSET_KEYS, EFFECT_ASSET_KEYS, UI_ASSET_KEYS } from '../assets/asset-keys'
import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'

export class PreloadScene extends BaseScene {
  constructor() {
    super({
      key: SCENE_KEYS.PRELOAD_SCENE,
    })
  }

  preload() {
    super.preload()

    const cardAssetsPath = 'assets/images/cards'
    const boardAssetsPath = 'assets/images/boards'
    const effectAssetsPath = 'assets/images/effects'
    const jsonAssetPath = 'assets/data'

    // Board Assets
    this.load.image(UI_ASSET_KEYS.BOARD, `${boardAssetsPath}/board.webp`)

    // Card Assets
    this.load.image(CARD_ASSETS_KEYS.TEMPLATE, `${cardAssetsPath}/card-template.png`)
    this.load.image(CARD_ASSETS_KEYS.CARD_BACK, `${cardAssetsPath}/card-back.webp`)

    // Effect Assets
    this.load.image(EFFECT_ASSET_KEYS.SPARK, `${effectAssetsPath}/spark.png`)

    // JSON Data
    this.load.json(DATA_ASSET_KEYS.CARDS, `${jsonAssetPath}/cards.json`)
  }

  create() {
    this.scene.start(SCENE_KEYS.BATTLE_SCENE)
  }
}
