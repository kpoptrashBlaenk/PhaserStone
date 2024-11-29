import { CardAssetKeys } from '../../../src/assets/asset-keys'
import { ClassKeys, RaceKeys, TypeKeys } from '../../../src/gameObjects/card/card-keys'

export type CardData = {
  assetKey: CardAssetKeys
  attack: number
  cardClass: ClassKeys
  cost: number
  health: number
  id: number
  mechanics?: string[]
  name: string
  races?: RaceKeys[]
  type: TypeKeys
}

export class Card {
  private card: CardData

  constructor(cardData: CardData) {
    this.card = cardData
  }

  public get assetKey(): CardAssetKeys {
    return this.card.assetKey
  }

  public get attack(): number {
    return this.card.attack
  }

  public get cost(): number {
    return this.card.cost
  }

  public get health(): number {
    return this.card.health
  }

  public get name(): string {
    return this.card.name
  }
}
