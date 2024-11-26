import { DATA_ASSET_KEYS } from '../assets/asset-keys'
import { Deck } from '../gameObjects/deck'
import { BoardUIController } from '../ui/board-ui-controller'
import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'
import { Hand } from '../gameObjects/hand'
import { Board } from '../gameObjects/player-board'
import { Card } from '../gameObjects/card'

export class BattleScene extends BaseScene {
  private boardUI: BoardUIController
  private playerDeck: Deck
  private opponentDeck: Deck
  private playerHand: Hand
  private opponentHand: Hand
  private playerBoard: Board
  private opponentBoard: Board

  constructor() {
    super({
      key: SCENE_KEYS.BATTLE_SCENE,
    })
  }

  create() {
    // Create UIs
    const playCardCallback = this.playerPlayCard.bind(this) // Bind this Scene to the callback to keep context
    this.boardUI = new BoardUIController(this, playCardCallback) // BoardUI handles all UIs found on board (Board, Hand, Hero, Deck...)

    // Create decks
    this.playerDeck = new Deck(this.cache.json.get(DATA_ASSET_KEYS.CARDS)) // All Cards that exist currently
    this.opponentDeck = new Deck(this.cache.json.get(DATA_ASSET_KEYS.CARDS))

    // Create Hand
    this.playerHand = new Hand()
    this.opponentHand = new Hand()

    // Create Board
    this.playerBoard = new Board()
    this.opponentBoard = new Board()

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

    this.opponentPlayCard(this.opponentHand.hand[0])
    this.opponentPlayCard(this.opponentHand.hand[0])
    this.opponentPlayCard(this.opponentHand.hand[0])
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

  private playerPlayCard(card: Card): void {
    const cardUI = this.boardUI.playerHandUI.getCardContainer(card)

    if (cardUI) {
      this.playerHand.playCard(card)
      this.boardUI.playerHandUI.playCard(cardUI)
      this.playerBoard.playMinion(card)
      this.boardUI.playerBoardUI.playCard(card)
    }
  }

  private opponentPlayCard(card: Card): void {
    const cardUI = this.boardUI.opponentHandUI.getCardContainer(card)
    console.log(card)

    if (cardUI) {
      this.opponentHand.playCard(card)
      this.boardUI.opponentHandUI.playCard(cardUI)
      this.opponentBoard.playMinion(card)
      this.boardUI.opponentBoardUI.playCard(card)
    }
  }
}
