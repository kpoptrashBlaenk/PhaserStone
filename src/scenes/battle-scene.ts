import { DATA_ASSET_KEYS } from '../assets/asset-keys'
import { Deck } from '../gameObjects/deck'
import { BoardUI } from '../ui/board-ui'
import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'
import { Hand } from '../gameObjects/hand'
import { PlayerBoard } from '../gameObjects/player-board'

export class BattleScene extends BaseScene {
  private boardUI: BoardUI
  private playerDeck: Deck
  private playerHand: Hand
  private playerBoard: PlayerBoard

  constructor() {
    super({
      key: SCENE_KEYS.BATTLE_SCENE,
    })
  }

  create() {
    // Create UIs
    this.boardUI = new BoardUI(this) // BoardUI handles all UIs found on board (Board, Hand, Hero, Deck...)

    // Create decks
    this.playerDeck = new Deck(this.cache.json.get(DATA_ASSET_KEYS.CARDS)) // All Cards that exist currently

    // Create Hand
    this.playerHand = new Hand()

    // Create Board
    this.playerBoard = new PlayerBoard()

    this.playerTurnStart()
  }

  private playerTurnStart(): void {
    this.drawCard()
    this.drawCard()
    this.drawCard()

    this.playCard()
  }

  private drawCard(): void {
    const card = this.playerDeck.drawCard() // Draw from Deck
    if (card) {
      this.playerHand.drawCard(card) // Add Card to Hand
      this.boardUI.handUI.drawCard(card) // Add Card UI to Hand
    } else {
      console.log('Fatigue')
    }
  }

  private playCard(): void {
    this.playerBoard.playMinion(this.playerHand.playCard(0))
    console.log(this.playerBoard.minionsOnBoard)
  }
}
