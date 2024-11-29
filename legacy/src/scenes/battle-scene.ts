import { DATA_ASSET_KEYS } from '../../../src/assets/asset-keys'
import { Deck } from '../gameObjects/deck'
import { BoardUIController } from '../ui/board-ui-controller'
import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'
import { Hand } from '../gameObjects/hand'
import { Board } from '../gameObjects/board'
import { EVENTS_KEYS, TargetKeys, TARGETS_KEYS } from '../utils/event-keys'
import { emitDrawFromDeck, emitCardPlayedOnBoard } from '../utils/event-emitters'

export class BattleScene extends BaseScene {
  private boardUI: BoardUIController
  private playerDeck: Deck
  private opponentDeck: Deck
  private playerHand: Hand
  private opponentHand: Hand
  private playerBoard: Board
  private opponentBoard: Board
  private currentTurn: TargetKeys

  constructor() {
    super({
      key: SCENE_KEYS.BATTLE_SCENE,
    })
  }

  create() {
    // Create UIs
    this.boardUI = new BoardUIController(this, this.events) // BoardUI handles all UIs found on board (Board, Hand, Hero, Deck...)

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

    // End Turn Button
    this.boardUI.endTurnButton.on('pointerup', () => {
      this.currentTurn === TARGETS_KEYS.PLAYER
        ? this.turnStart(TARGETS_KEYS.OPPONENT)
        : this.turnStart(TARGETS_KEYS.PLAYER)
    })

    // Start Game
    emitDrawFromDeck(this.events, TARGETS_KEYS.PLAYER)
    emitDrawFromDeck(this.events, TARGETS_KEYS.PLAYER)
    emitDrawFromDeck(this.events, TARGETS_KEYS.PLAYER)
    emitDrawFromDeck(this.events, TARGETS_KEYS.OPPONENT)
    emitDrawFromDeck(this.events, TARGETS_KEYS.OPPONENT)
    emitDrawFromDeck(this.events, TARGETS_KEYS.OPPONENT)

    this.turnStart(TARGETS_KEYS.OPPONENT)
    emitCardPlayedOnBoard(this.events, TARGETS_KEYS.OPPONENT, this.opponentHand.hand[0])
  }

  /**
   * Start the turn of this player
   */
  private turnStart(player: TargetKeys): void {
    this.currentTurn = player
    emitDrawFromDeck(this.events, player)
  }
}
