import { DATA_ASSET_KEYS } from '../assets/asset-keys'
import { Deck } from '../gameObjects/deck/deck'
import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'

export class BattleScene extends BaseScene {
  private playerDeck: Deck
  private opponentDeck: Deck

  constructor() {
    super({
      key: SCENE_KEYS.BATTLE_SCENE,
    })
  }

  create(): void {
    this.playerDeck = new Deck(this, this.cache.json.get(DATA_ASSET_KEYS.CARDS))
    this.opponentDeck = new Deck(this, this.cache.json.get(DATA_ASSET_KEYS.CARDS))
  }
}
