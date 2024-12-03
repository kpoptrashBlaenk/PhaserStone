import { CARD_ASSETS_KEYS, DATA_ASSET_KEYS } from '../assets/asset-keys'
import { Background } from '../ui/board-background'
import { CLASS_KEYS, TYPE_KEYS } from '../gameObjects/card/card-keys'
import { Preview } from '../gameObjects/card/preview-card'
import { Deck } from '../gameObjects/deck'
import { Hand } from '../gameObjects/hand'
import { BATTLE_STATES, TARGET_KEYS, TargetKeys } from '../utils/keys'
import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'
import { Board } from '../gameObjects/board'
import { HandCard } from '../gameObjects/card/hand-card'
import { StateMachine } from '../utils/state-machine'
import { BoardCard } from '../gameObjects/card/board-card'

export class BattleScene extends BaseScene {
  public playerPreview: Preview
  public playerBoard: Board
  public stateMachine: StateMachine
  public currentTurn: TargetKeys
  private playerDeck: Deck
  private opponentDeck: Deck
  private playerHand: Hand
  private opponentHand: Hand
  private opponentPreview: Preview
  private opponentBoard: Board
  private chosenMinions: {
    player: BoardCard | undefined
    opponent: BoardCard | undefined
  }

  constructor() {
    super({
      key: SCENE_KEYS.BATTLE_SCENE,
    })

    this.chosenMinions = {
      player: undefined,
      opponent: undefined,
    }
  }

  create(): void {
    super.create()

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

    this.playerBoard = new Board(this, TARGET_KEYS.PLAYER)
    this.opponentBoard = new Board(this, TARGET_KEYS.OPPONENT)

    // State Machine
    this.createStateMachine()

    // Game Start
    this.drawCard(TARGET_KEYS.PLAYER)
    this.drawCard(TARGET_KEYS.PLAYER)
    this.drawCard(TARGET_KEYS.PLAYER)
    this.drawCard(TARGET_KEYS.OPPONENT)
    this.drawCard(TARGET_KEYS.OPPONENT)
    this.drawCard(TARGET_KEYS.OPPONENT)

    this.startTurn(TARGET_KEYS.PLAYER)
    this.stateMachine.setState(BATTLE_STATES.PLAYER_TURN)

    this.opponentBoard.playCard(previewTemplate)
    // this.playerBoard.playCard(previewTemplate)
  }

  update(): void {
    super.update()

    this.stateMachine.update()
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

  /**
   * Create the state machine
   *
   * PLAYER_TURN:
   *
   * MINION_CHOSEN_FOR_BATTLE:
   *
   * MINION_BATTLE:
   */
  private createStateMachine(): void {
    this.stateMachine = new StateMachine('battle', this)

    this.stateMachine.addState({
      name: BATTLE_STATES.PLAYER_TURN,
      onEnter: () => {},
    })

    this.stateMachine.addState({
      name: BATTLE_STATES.PLAYER_MINION_CHOSEN,
      onEnter: (playerMinion: BoardCard) => {
        console.log(`Player: ${playerMinion.cardData.name}`)
        this.chosenMinions.player = playerMinion
      },
    })

    this.stateMachine.addState({
      name: BATTLE_STATES.OPPONENT_MINION_CHOSEN,
      onEnter: (opponentMinion: BoardCard) => {
        console.log(`Opponent: ${opponentMinion.cardData.name}`)
        this.chosenMinions.opponent = opponentMinion
        this.stateMachine.setState(BATTLE_STATES.MINION_BATTLE)
      },
    })

    this.stateMachine.addState({
      name: BATTLE_STATES.MINION_BATTLE,
      onEnter: () => {
        if (this.chosenMinions.opponent) {
          console.log(
            `${this.chosenMinions.player?.cardData.name} vs ${this.chosenMinions.opponent?.cardData.name}`
          )

          this.playerBoard.depth = 1
          this.chosenMinions.player?.attack(this.chosenMinions.opponent, () => {
            this.playerBoard.depth = 0
            this.stateMachine.setState(BATTLE_STATES.AFTER_BATTLE_CHECK)
          })
        }
      },
    })

    this.stateMachine.addState({
      name: BATTLE_STATES.MINION_DEATH,
      onEnter: (targetMinion: BoardCard) => {
        console.log(`${targetMinion.cardData.name} died`)
        this.stateMachine.setState(BATTLE_STATES.PLAYER_TURN)
      },
    })

    this.stateMachine.addState({
      name: BATTLE_STATES.AFTER_BATTLE_CHECK,
      onEnter: () => {
        const attacker = this.chosenMinions.player
        const defender = this.chosenMinions.opponent

        if (attacker && defender) {
          if (attacker.cardData.health <= 0) {
            attacker.death()
          }
          if (defender.cardData.health <= 0) {
            defender.death()
          }
        }

        this.stateMachine.setState(BATTLE_STATES.PLAYER_TURN)
      },
    })
  }
}
