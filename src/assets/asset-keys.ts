export const CARD_ASSETS_KEYS = Object.freeze({
  TEMPLATE: 'TEMPLATE',
  CARD_BACK: 'CARD_BACK',
})
export type CardAssetKeys = keyof typeof CARD_ASSETS_KEYS

export const DATA_ASSET_KEYS = Object.freeze({
  CARDS: 'CARDS',
})

export const UI_ASSET_KEYS = Object.freeze({
  BOARD: 'BOARD',
  MANA_CRYSTAL: 'MANA_CRYSTAL',
  HEALTH: 'HEALTH',
  ATTACK: 'ATTACK',
  CANCEL: 'CANCEL',
})

export const EFFECT_ASSET_KEYS = Object.freeze({
  SPARK: 'SPARK',
  Z: 'Z',
})
