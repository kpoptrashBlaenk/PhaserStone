import { CardAssetKeys } from '../assets/asset-keys'
import { ClassKeys, RaceKeys, TypeKeys } from '../types/typedef'

export type CardData = {
  assetKey: CardAssetKeys
  attack: number
  cardClass: ClassKeys
  cost: number
  health: number
  id: number
  mechanics: string[]
  name: string
  races: RaceKeys[]
  type: TypeKeys
}

export class Card {
  private card: CardData

  constructor(cardData: CardData) {
    this.card = cardData
  }

  public get assetKey() {
    return this.card.assetKey
  }
}
