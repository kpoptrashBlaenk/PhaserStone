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
    this.load.image(CARD_ASSETS_KEYS.ABUSIVE_SERGEANT, `${cardAssetsPath}/Abusive-Sergeant.png`)
    this.load.image(CARD_ASSETS_KEYS.ARMOR_VENDOR, `${cardAssetsPath}/Armor-Vendor.png`)
    this.load.image(CARD_ASSETS_KEYS.BEAMING_SIDEKICK, `${cardAssetsPath}/Beaming-Sidekick.png`)
    this.load.image(CARD_ASSETS_KEYS.ELVEN_ARCHER, `${cardAssetsPath}/Elven-Archer.png`)
    this.load.image(CARD_ASSETS_KEYS.FIRE_FLY, `${cardAssetsPath}/Fire-Fly.png`)
    this.load.image(CARD_ASSETS_KEYS.GLACIAL_SHARD, `${cardAssetsPath}/Glacial-Shard.png`)
    this.load.image(CARD_ASSETS_KEYS.MURLOC_TIDECALLER, `${cardAssetsPath}/Murloc-Tidecaller.png`)
    this.load.image(CARD_ASSETS_KEYS.MURMY, `${cardAssetsPath}/Murmy.png`)
    this.load.image(CARD_ASSETS_KEYS.SOUTHSEA_DECKHAND, `${cardAssetsPath}/Southsea-Deckhand.png`)

    // JSON Data
    this.load.json(DATA_ASSET_KEYS.CARDS, 'assets/data/cards.json')
  }

  create() {
    this.scene.start(SCENE_KEYS.GAME_SCENE)
  }
}
