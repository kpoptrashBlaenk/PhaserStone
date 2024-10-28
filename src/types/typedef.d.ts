import { CardAssetKeys } from '../assets/asset-keys'

export const CLASS_KEYS = Object.freeze({
  NEUTRAL: 'NEUTRAL',
})
export type ClassKeys = keyof typeof CLASS_KEYS

export const TYPE_KEYS = Object.freeze({
  MINION: 'MINION',
})
export type TypeKeys = keyof typeof TYPE_KEYS

export const RACE_KEYS = Object.freeze({
  BEAST: 'BEAST',
})
export type RaceKeys = keyof typeof TYPE_KEYS

export type Card = {
  assetKey: CardAssetKeys
  attack: number
  cardClass: ClassKeys
  cost: number
  health: number
  id: number
  races: RaceKeys[]
  type: TypeKeys
}

export type Deck = Card[]
export type Hand = Card[]