import { CardAssetKeys } from '../../assets/asset-keys'

export type CardData = {
  assetKey: CardAssetKeys
  attack: number
  cardClass: ClassKeys
  cost: number
  health: number
  id: number
  battlecry?: {
    type: string
    amount: number
  }
  text: string
  name: string
  races?: RaceKeys[]
  type: TypeKeys
}

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
