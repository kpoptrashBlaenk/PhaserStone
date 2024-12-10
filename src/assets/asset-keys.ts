export const CARD_ASSETS_KEYS = Object.freeze({
  TEMPLATE: 'TEMPLATE',
  CARD_BACK: 'CARD_BACK',
  SNOWFLIPPER_PENGUIN: 'SNOWFLIPPER_PENGUIN',
  ABUSIVE_SERGEANT: 'ABUSIVE_SERGEANT',
  ARMOR_VENDOR: 'ARMOR_VENDOR',
  BEAMING_SIDEKICK: 'BEAMING_SIDEKICK',
  ELVEN_ARCHER: 'ELVEN_ARCHER',
  FIRE_FLY: 'FIRE_FLY',
  GLACIAL_SHARD: 'GLACIAL_SHARD',
  MURLOC_TIDECALLER: 'MURLOC_TIDECALLER',
  MURMY: 'MURMY',
  SOUTHSEA_DECKHAND: 'SOUTHSEA_DECKHAND',
})
export type CardAssetKeys = keyof typeof CARD_ASSETS_KEYS

export const DATA_ASSET_KEYS = Object.freeze({
  CARDS: 'CARDS',
})

export const UI_ASSET_KEYS = Object.freeze({
  BOARD: 'BOARD',
  MANA_CRYSTAL: 'MANA_CRYSTAL',
  HEALTH: 'HEALTH',
})

export const EFFECT_ASSET_KEYS = Object.freeze({
  SPARK: 'SPARK',
  Z: 'Z',
})
