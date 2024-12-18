import { CardAssetKeys } from '../assets/asset-keys'

export type BattlecryMinion = {
  target: string
  type: string
  amount: number
}

export type CardData = {
  id: number
  name: string
  text: string
  cost: number
  attack: number
  health: number
  assetKey: string
}