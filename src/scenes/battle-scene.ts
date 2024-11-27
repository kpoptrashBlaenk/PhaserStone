import { DATA_ASSET_KEYS } from '../assets/asset-keys'
import { Deck } from '../gameObjects/deck'
import { BoardUIController } from '../ui/board-ui-controller'
import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'
import { Hand } from '../gameObjects/hand'
import { Board } from '../gameObjects/board'
import { Card } from '../gameObjects/card'
import { TARGETS_KEYS } from '../utils/event-keys'
import { emitDrawFromDeck } from '../utils/event-emitters'

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
    this.boardUI = new BoardUIController(this, playCardCallback, this.events) // BoardUI handles all UIs found on board (Board, Hand, Hero, Deck...)

    // Create decks
    this.playerDeck = new Deck(this.cache.json.get(DATA_ASSET_KEYS.CARDS), TARGETS_KEYS.PLAYER, this.events) // All Cards that exist currently
    this.opponentDeck = new Deck(
      this.cache.json.get(DATA_ASSET_KEYS.CARDS),
      TARGETS_KEYS.OPPONENT,
      this.events
    )

    // Create Hand
    this.playerHand = new Hand(TARGETS_KEYS.PLAYER, this.events)
    this.opponentHand = new Hand(TARGETS_KEYS.OPPONENT, this.events)

    // Create Board
    this.playerBoard = new Board(TARGETS_KEYS.PLAYER, this.events)
    this.opponentBoard = new Board(TARGETS_KEYS.PLAYER, this.events)

    this.opponentTurnStart()
    this.playerTurnStart()
  }

  private playerTurnStart(): void {
    emitDrawFromDeck(this.events, TARGETS_KEYS.PLAYER)
  }

  private opponentTurnStart(): void {
    emitDrawFromDeck(this.events, TARGETS_KEYS.OPPONENT)
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

    if (cardUI) {
      this.opponentHand.playCard(card)
      this.boardUI.opponentHandUI.playCard(cardUI)
      this.opponentBoard.playMinion(card)
      this.boardUI.opponentBoardUI.playCard(card)
    }
  }
}
