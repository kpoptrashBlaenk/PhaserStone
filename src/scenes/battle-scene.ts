import { DATA_ASSET_KEYS } from '../assets/asset-keys'
import { Deck } from '../gameObjects/deck'
import { Hand } from '../gameObjects/hand'
import { TARGET_KEYS, TargetKeys } from '../utils/keys'
import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'

export class BattleScene extends BaseScene {
  private playerDeck: Deck
  private opponentDeck: Deck
  private playerHand: Hand
  private opponentHand: Hand

  constructor() {
    super({
      key: SCENE_KEYS.BATTLE_SCENE,
    })
  }

  create(): void {
    // Decks
    this.playerDeck = new Deck(this, this.cache.json.get(DATA_ASSET_KEYS.CARDS), TARGET_KEYS.PLAYER)
    this.opponentDeck = new Deck(this, this.cache.json.get(DATA_ASSET_KEYS.CARDS), TARGET_KEYS.OPPONENT)

    // Hands
    this.playerHand = new Hand(this, TARGET_KEYS.PLAYER)
    this.opponentHand = new Hand(this, TARGET_KEYS.OPPONENT)

    // Game Start
    this.drawCard(TARGET_KEYS.PLAYER)
    this.drawCard(TARGET_KEYS.PLAYER)
    this.drawCard(TARGET_KEYS.PLAYER)
    this.drawCard(TARGET_KEYS.OPPONENT)
    this.drawCard(TARGET_KEYS.OPPONENT)
    this.drawCard(TARGET_KEYS.OPPONENT)
  }

  /**
   * Target draws card from Deck and adds it to Hand
   */
  private drawCard(target: TargetKeys): void {
    if (target === TARGET_KEYS.PLAYER) {
      const card = this.playerDeck.drawCard()
      if (card) {
        this.playerHand.drawCard(card)
      }
    } else {
      const card = this.opponentDeck.drawCard()
      if (card) {
        this.opponentHand.drawCard(card)
      }
    }
  }
}
