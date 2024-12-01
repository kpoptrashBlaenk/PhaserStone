import { CARD_ASSETS_KEYS, DATA_ASSET_KEYS } from '../assets/asset-keys'
import { Background } from '../ui/board-background'
import { CLASS_KEYS, TYPE_KEYS } from '../gameObjects/card/card-keys'
import { Preview } from '../gameObjects/card/preview-card'
import { Deck } from '../gameObjects/deck'
import { Hand } from '../gameObjects/hand'
import { TARGET_KEYS, TargetKeys } from '../utils/keys'
import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'
import { Board } from '../gameObjects/board'
import { HandCard } from '../gameObjects/card/hand-card'

export class BattleScene extends BaseScene {
  public playerPreview: Preview
  public playerBoard: Board
  public currentTurn: TargetKeys
  private playerDeck: Deck
  private opponentDeck: Deck
  private playerHand: Hand
  private opponentHand: Hand
  private opponentPreview: Preview
  private opponentBoard: Board

  constructor() {
    super({
      key: SCENE_KEYS.BATTLE_SCENE,
    })
  }

  create(): void {
    // Background
    new Background(this)

    // Decks
    this.playerDeck = new Deck(this, this.cache.json.get(DATA_ASSET_KEYS.CARDS), TARGET_KEYS.PLAYER)
    this.opponentDeck = new Deck(this, this.cache.json.get(DATA_ASSET_KEYS.CARDS), TARGET_KEYS.OPPONENT)

    // Hands
    this.playerHand = new Hand(this, TARGET_KEYS.PLAYER)
    this.opponentHand = new Hand(this, TARGET_KEYS.OPPONENT)

    // Preview
    const previewTemplate = {
      assetKey: CARD_ASSETS_KEYS.TEMPLATE,
      attack: 0,
      cardClass: CLASS_KEYS.NEUTRAL,
      cost: 0,
      health: 0,
      id: 0,
      name: 'Preview',
      type: TYPE_KEYS.MINION,
    }
    this.playerPreview = new Preview(this, previewTemplate, TARGET_KEYS.PLAYER)
    this.opponentPreview = new Preview(this, previewTemplate, TARGET_KEYS.OPPONENT)

    this.playerBoard = new Board(this, TARGET_KEYS.PLAYER)
    this.opponentBoard = new Board(this, TARGET_KEYS.OPPONENT)

    // Game Start
    this.drawCard(TARGET_KEYS.PLAYER)
    this.drawCard(TARGET_KEYS.PLAYER)
    this.drawCard(TARGET_KEYS.PLAYER)
    this.drawCard(TARGET_KEYS.OPPONENT)
    this.drawCard(TARGET_KEYS.OPPONENT)
    this.drawCard(TARGET_KEYS.OPPONENT)

    this.startTurn(TARGET_KEYS.PLAYER)

  }

  /**
   * Target plays card from Hand and adds it to Board
   */
  public playCard(card: HandCard, target: TargetKeys): void {
    if (target === TARGET_KEYS.PLAYER) {
      this.playerHand.playCard(card)
      this.playerBoard.playCard(card.cardData)
    } else {
      this.opponentHand.playCard(card)
      this.opponentBoard.playCard(card.cardData)
    }
  }

  /**
   * Target's turn starts
   */
  private startTurn(target: TargetKeys): void {
    this.currentTurn = target
    this.drawCard(target)
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
