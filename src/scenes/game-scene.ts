import Phaser from 'phaser'
import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'
import { Board } from '../battle/board'
import { Deck } from '../types/typedef'
import { DATA_ASSET_KEYS } from '../assets/asset-keys'

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
    this.playerDeck = this.cache.json.get(DATA_ASSET_KEYS.CARDS)

    this.playerTurnStart()
  }

  private playerTurnStart(): void {
    this.drawCard()
  }

  private drawCard(): void {
    if (this.playerDeck.length > 0) {
      this.board.addCardToPlayerHand(this.playerDeck.shift())
    } else {
        console.log('fatigue')
    }
  }
}
