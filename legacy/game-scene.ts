import Phaser from 'phaser'
import { BaseScene } from '../src/scenes/base-scene'
import { SCENE_KEYS } from '../src/scenes/scene-keys'
import { Board } from '../battle/board'
import { DATA_ASSET_KEYS } from '../src/assets/asset-keys'
import { Deck } from '../cards/deck'
import { Hand } from '../cards/hand'

export class GameScene extends BaseScene {
  private board: Board
  private playerDeck: Deck
  private playerHand: Hand

  constructor() {
    super({
      key: SCENE_KEYS.GAME_SCENE,
    })
  }

  create() {
    this.board = new Board(this)

    // Player Deck
    this.playerDeck = new Deck(this.cache.json.get(DATA_ASSET_KEYS.CARDS))

    this.playerHand = new Hand(this, this.board.playerHandContainerGet)

    this.playerTurnStart()
  }

  private playerTurnStart(): void {
    this.drawCard()
    this.drawCard()
    this.drawCard()
    this.drawCard()
    this.drawCard()
    this.drawCard()
    this.drawCard()
    this.drawCard()
    this.drawCard()
    this.drawCard()
  }

  private drawCard(): void {
    const card = this.playerDeck.draw()
    if (card) {
      this.playerHand.addCard(card)
    } else {
      console.log('fatigue')
    }
  }
}
