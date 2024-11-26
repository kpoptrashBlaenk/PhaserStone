import { DATA_ASSET_KEYS } from '../assets/asset-keys'
import { Deck } from '../gameObjects/deck'
import { BoardUI } from '../ui/board-ui'
import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'
import { Hand } from '../gameObjects/hand'
import { PlayerBoard } from '../gameObjects/player-board'
import { Card } from '../gameObjects/card'

export class BattleScene extends BaseScene {
  private boardUI: BoardUI
  private playerDeck: Deck
  private opponentDeck: Deck
  private playerHand: Hand
  private opponentHand: Hand
  private playerBoard: PlayerBoard
  private opponentBoard: PlayerBoard

  constructor() {
    super({
      key: SCENE_KEYS.BATTLE_SCENE,
    })
  }

  create() {
    // Create UIs
    const playCardCallback = this.playCard.bind(this) // Bind this Scene to the callback to keep context
    this.boardUI = new BoardUI(this, playCardCallback) // BoardUI handles all UIs found on board (Board, Hand, Hero, Deck...)

    // Create decks
    this.playerDeck = new Deck(this.cache.json.get(DATA_ASSET_KEYS.CARDS)) // All Cards that exist currently
    this.opponentDeck = new Deck(this.cache.json.get(DATA_ASSET_KEYS.CARDS))

    // Create Hand
    this.playerHand = new Hand()
    this.opponentHand = new Hand()

    // Create Board
    this.playerBoard = new PlayerBoard()
    this.opponentBoard = new PlayerBoard()

    this.playerTurnStart()
    this.opponentTurnStart()
  }

  private playerTurnStart(): void {
    this.playerDrawCard()
    this.playerDrawCard()
    this.playerDrawCard()
  }

  private opponentTurnStart(): void {
    this.opponentDrawCard()
    this.opponentDrawCard()
    this.opponentDrawCard()
  }

  private playerDrawCard(): void {
    const card = this.playerDeck.drawCard() // Draw from Deck
    if (card) {
      this.playerHand.drawCard(card) // Add Card to Hand
      this.boardUI.playerHandUI.drawCard(card) // Add Card UI to Hand
    } else {
      console.log('Fatigue')
    }
  }

  private opponentDrawCard(): void {
    const card = this.opponentDeck.drawCard() // Draw from Deck
    if (card) {
      this.opponentHand.drawCard(card) // Add Card to Hand
      this.boardUI.opponentHandUI.drawCard(card) // Add Card UI to Hand
    } else {
      console.log('Fatigue')
    }
  }

  private playCard(card: Card): void {
    const cardUI = this.boardUI.playerHandUI.getCardContainer(card)

    if (cardUI) {
      this.playerHand.playCard(card)
      this.boardUI.playerHandUI.playCard(cardUI)
      this.playerBoard.playMinion(card)
      this.boardUI.playerBoardUI.playCard(card)
    }
  }
}
