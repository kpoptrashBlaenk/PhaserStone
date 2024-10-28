import Phaser from 'phaser'
import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'
import { Board } from '../battle/board'
import { DATA_ASSET_KEYS } from '../assets/asset-keys'
import { Deck } from '../cards/deck'

export class GameScene extends BaseScene {
  private board: Board
  private playerDeck: Deck

  constructor() {
    super({
      key: SCENE_KEYS.GAME_SCENE,
    })
  }

  create() {
    this.board = new Board(this)

    // Player Deck
    this.playerDeck = new Deck(this.cache.json.get(DATA_ASSET_KEYS.CARDS))

    this.playerTurnStart()
  }

  private playerTurnStart(): void {
    this.drawCard()
  }

  private drawCard(): void {
    const card = this.playerDeck.draw()
    if (card) {
      this.board.addCardToPlayerHand(card)
    } else {
      console.log('fatigue')
    }
  }
}
