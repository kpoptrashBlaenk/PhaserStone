export const BATTLECRY_TARGET = Object.freeze({
  ANY: 'ANY',
  ENEMY: 'ENEMY',
  FRIENDLY: 'FRIENDLY',
  RANDOM_ENEMY: 'RANDOM_ENEMY',
  RANDOM_FRIENDLY: 'RANDOM_FRIENDLY',
  RANDOM_ENEMY_MINION: 'RANDOM_ENEMY_MINION',
  RANDOM_FRIENDLY_MINION: 'RANDOM_FRIENDLY_MINION',
  ENEMY_HERO: 'ENEMY_HERO',
  FRIENDLY_HERO: 'FRIENDLY_HERO',
})
export type BattlecryTarget = keyof typeof BATTLECRY_TARGET

export const BATTLECRY_TYPE = Object.freeze({
  HEAL: 'HEAL',
  DAMAGE: 'DAMAGE',
})
export type BattlecryType = keyof typeof BATTLECRY_TYPE

export type Battlecry = {
  target: BattlecryTarget
  type: BattlecryType
  amount: number
}

export type CardData = {
  id: number
  trackId: string
  name: string
  text: string
  cost: number
  attack: number
  health: number
  assetKey: string
  battlecry?: Battlecry
}
