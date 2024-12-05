import { CARD_ASSETS_KEYS, DATA_ASSET_KEYS } from '../assets/asset-keys'
import { Background } from '../ui/board-background'
import { CLASS_KEYS, TYPE_KEYS } from '../gameObjects/card/card-keys'
import { Preview } from '../gameObjects/card/preview-card'
import { Deck } from '../gameObjects/deck'
import { Hand } from '../gameObjects/hand'
import { BATTLE_STATES, BATTLE_TARGET_KEYS, BattleTargetKeys, TARGET_KEYS, TargetKeys } from '../utils/keys'
import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'
import { Board } from '../gameObjects/board'
import { HandCard } from '../gameObjects/card/hand-card'
import { StateMachine } from '../utils/state-machine'
import { BoardCard } from '../gameObjects/card/board-card'

export class BattleScene extends BaseScene {
  public stateMachine: StateMachine
  public playerPreview: Preview
  private opponentPreview: Preview

  private deck: {
    PLAYER: Deck
    OPPONENT: Deck
  } = { PLAYER: null as any, OPPONENT: null as any }
  private hand: {
    PLAYER: Hand
    OPPONENT: Hand
  } = { PLAYER: null as any, OPPONENT: null as any }
  private board: {
    PLAYER: Board
    OPPONENT: Board
  } = { PLAYER: null as any, OPPONENT: null as any }

  constructor() {
    super({
      key: SCENE_KEYS.BATTLE_SCENE,
    })

    this.chosenBattleMinions[BATTLE_TARGET_KEYS.ATTACKER] = undefined
    this.chosenBattleMinions[BATTLE_TARGET_KEYS.DEFENDER] = undefined
  }

  create(): void {
    super.create()

    this.setupBackground()
    this.setupDecksAndHands()
    this.setupPreviews()
    this.setupBoards()
    this.setupStateMachine()

    // Game Start
    this.stateMachine.setState(BATTLE_STATES.PLAYER_TURN_START)
  }

  update(): void {
    super.update()

    this.stateMachine.update()
  }

  /**
   * Sets up background
   */
  private setupBackground(): void {
    new Background(this)
  }

  /**
   * Sets up decks and hands
   */
  private setupDecksAndHands(): void {
    this.deck.PLAYER = new Deck(this, this.cache.json.get(DATA_ASSET_KEYS.CARDS), TARGET_KEYS.PLAYER)
    this.deck.OPPONENT = new Deck(this, this.cache.json.get(DATA_ASSET_KEYS.CARDS), TARGET_KEYS.OPPONENT)

    this.hand.PLAYER = new Hand(this, TARGET_KEYS.PLAYER)
    this.hand.OPPONENT = new Hand(this, TARGET_KEYS.OPPONENT)
  }

  /**
   * Sets up previews
   */
  private setupPreviews(): void {
    const previewTemplate = {
      assetKey: CARD_ASSETS_KEYS.TEMPLATE,
      attack: 4,
      cardClass: CLASS_KEYS.NEUTRAL,
      cost: 0,
      health: 9,
      id: 0,
      name: 'Preview',
      type: TYPE_KEYS.MINION,
    }
    this.playerPreview = new Preview(this, previewTemplate, TARGET_KEYS.PLAYER)
    this.opponentPreview = new Preview(this, previewTemplate, TARGET_KEYS.OPPONENT)
  }

  /**
   * Sets up boards
   */
  private setupBoards(): void {
    this.board.PLAYER = new Board(this, TARGET_KEYS.PLAYER)
    this.board.OPPONENT = new Board(this, TARGET_KEYS.OPPONENT)
  }

  /**
   * Sets up state machine
   */
  private setupStateMachine(): void {
    this.createStateMachine()
  }

  /**
   * Target draws card
   */
  private drawCard(target: TargetKeys, callback?: () => void): void {
    this.deck[target].drawCard((card) => {
      this.hand[target].drawCard(card, () => {
        callback?.()
      })
    })
  }

  /**
   * Target plays card
   */
  private playCard(target: TargetKeys, card: HandCard, callback?: () => void): void {
    this.hand[target].playCard(card, () => {
      this.board[target].playCard(card.cardData)
      callback?.()
    })
  }

  /**
   * Track and set attacker and defender minions
   */
  private chosenBattleMinions: Record<BattleTargetKeys, BoardCard | undefined> = {
    ATTACKER: undefined,
    DEFENDER: undefined,
  }

  /**
   * Create the state machine
   */
  private createStateMachine(): void {
    this.stateMachine = new StateMachine('battle', this)

    // Game Flow States
    this.stateMachine.addState({
      name: BATTLE_STATES.PLAYER_TURN_START,
      onEnter: () => {
        this.stateMachine.setState(BATTLE_STATES.PLAYER_DRAW_CARD)
      },
    })

    this.stateMachine.addState({
      name: BATTLE_STATES.OPPONENT_TURN_START,
      onEnter: () => {
        this.stateMachine.setState(BATTLE_STATES.OPPONENT_DRAW_CARD)
      },
    })

    // Player-Specific States
    this.stateMachine.addState({
      name: BATTLE_STATES.PLAYER_DRAW_CARD,
      onEnter: () =>
        this.drawCard(TARGET_KEYS.PLAYER, () => {
          this.stateMachine.setState(BATTLE_STATES.PLAYER_TURN)
        }),
    })

    this.stateMachine.addState({
      name: BATTLE_STATES.PLAYER_TURN,
      onEnter: () => {},
    })

    this.stateMachine.addState({
      name: BATTLE_STATES.PLAYER_PLAY_CARD,
      onEnter: (card: HandCard) => {
        this.playCard(TARGET_KEYS.PLAYER, card, () => {
          this.stateMachine.setState(BATTLE_STATES.PLAYER_TURN)
        })
      },
    })

    // Opponent-Specific States
    this.stateMachine.addState({
      name: BATTLE_STATES.OPPONENT_DRAW_CARD,
      onEnter: () =>
        this.drawCard(TARGET_KEYS.OPPONENT, () => {
          this.stateMachine.setState(BATTLE_STATES.OPPONENT_TURN)
        }),
    })

    this.stateMachine.addState({
      name: BATTLE_STATES.OPPONENT_TURN,
      onEnter: () => {
        const hand = this.hand.OPPONENT.handCards
        const card = hand[Math.floor(Math.random() * hand.length)]
        if (card) {
          this.stateMachine.setState(BATTLE_STATES.OPPONENT_PLAY_CARD, card)
        } else {
          this.stateMachine.setState(BATTLE_STATES.PLAYER_TURN_START)
        }
      },
    })

    this.stateMachine.addState({
      name: BATTLE_STATES.OPPONENT_PLAY_CARD,
      onEnter: (card: HandCard) => {
        this.playCard(TARGET_KEYS.OPPONENT, card)
        // Preview
        setTimeout(() => {
          setTimeout(() => {
            this.opponentPreview.hideCard()
            this.stateMachine.setState(BATTLE_STATES.OPPONENT_TURN)
          }, 1500)
          this.opponentPreview.modifyPreviewCardObjects(card.cardData, card.cardData)
        }, 250)
      },
    })

    // Battle States
    this.stateMachine.addState({
      name: BATTLE_STATES.ATTACKER_MINION_CHOSEN,
      onEnter: (attackerMinion: BoardCard) => {
        this.chosenBattleMinions[BATTLE_TARGET_KEYS.ATTACKER] = attackerMinion
      },
    })

    this.stateMachine.addState({
      name: BATTLE_STATES.DEFENDER_MINION_CHOSEN,
      onEnter: (defenderMinion: BoardCard) => {
        this.chosenBattleMinions[BATTLE_TARGET_KEYS.DEFENDER] = defenderMinion
        this.stateMachine.setState(BATTLE_STATES.MINION_BATTLE)
      },
    })

    this.stateMachine.addState({
      name: BATTLE_STATES.MINION_BATTLE,
      onEnter: () => {
        if (this.chosenBattleMinions.ATTACKER && this.chosenBattleMinions.DEFENDER) {
          this.board.PLAYER.depth = 1
          this.chosenBattleMinions.ATTACKER?.attack(this.chosenBattleMinions.DEFENDER, () => {
            this.board.PLAYER.depth = 0
            this.stateMachine.setState(BATTLE_STATES.AFTER_BATTLE_CHECK)
          })
        }
      },
    })

    this.stateMachine.addState({
      name: BATTLE_STATES.AFTER_BATTLE_CHECK,
      onEnter: () => {
        const attacker = this.chosenBattleMinions.ATTACKER
        const defender = this.chosenBattleMinions.DEFENDER

        if (attacker && defender) {
          // Check if attacker died
          if (attacker.cardData.health <= 0) {
            attacker.death(() => {
              this.board[attacker.player].cardDies(attacker)
            })
          }

          // Check if defender died
          if (defender.cardData.health <= 0) {
            defender.death(() => {
              defender.death(() => {
                this.board[defender.player].cardDies(defender)
              })
            })
          }
        }

        this.stateMachine.setState(BATTLE_STATES.PLAYER_TURN)
      },
    })
  }
}
