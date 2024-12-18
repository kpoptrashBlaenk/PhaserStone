import { EnemyAI } from '../common/enemy-ai'
import { Board } from '../objects/board'
import { Card } from '../objects/card'
import { Deck } from '../objects/deck'
import { Hand } from '../objects/hand'
import { Mana } from '../objects/mana'
import { Background } from '../ui/background'
import { AnimationManager } from '../utils/animation-manager'
import { STATES, TARGET_KEYS, TargetKeys } from '../utils/keys'
import { StateMachine } from '../utils/state-machine'
import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'

export class BattleScene extends BaseScene {
  private $animationManager: AnimationManager
  private $stateMachine: StateMachine
  private $enemyAI: EnemyAI

  private $deck: { PLAYER: Deck; ENEMY: Deck } = { PLAYER: null as any, ENEMY: null as any }
  private $hand: { PLAYER: Hand; ENEMY: Hand } = { PLAYER: null as any, ENEMY: null as any }
  private $mana: { PLAYER: Mana; ENEMY: Mana } = { PLAYER: null as any, ENEMY: null as any }
  private $board: { PLAYER: Board; ENEMY: Board } = { PLAYER: null as any, ENEMY: null as any }

  constructor() {
    super({
      key: SCENE_KEYS.BATTLE_SCENE,
    })
  }

  update(): void {
    super.update()

    this.$stateMachine.update()
  }

  create(): void {
    super.create()

    // Managers
    this.$animationManager = new AnimationManager(this)

    // State Machine
    this.$stateMachine = new StateMachine('battle', this)
    this.$createStateMachine()

    // Background
    new Background(this)

    // Deck
    this.$deck.PLAYER = new Deck(this, this.$stateMachine, TARGET_KEYS.PLAYER, this.$animationManager)
    this.$deck.ENEMY = new Deck(this, this.$stateMachine, TARGET_KEYS.ENEMY, this.$animationManager)

    // Hand
    this.$hand.PLAYER = new Hand(this, TARGET_KEYS.PLAYER, this.$animationManager)
    this.$hand.ENEMY = new Hand(this, TARGET_KEYS.ENEMY, this.$animationManager)

    // Mana
    this.$mana.PLAYER = new Mana(this, TARGET_KEYS.PLAYER)
    this.$mana.ENEMY = new Mana(this, TARGET_KEYS.ENEMY)

    // Board
    this.$board.PLAYER = new Board(this, TARGET_KEYS.PLAYER, this.$animationManager)
    this.$board.ENEMY = new Board(this, TARGET_KEYS.ENEMY, this.$animationManager)

    this.$enemyAI = new EnemyAI(this, this.$stateMachine, this.$hand.ENEMY, this.$board)

    this.$stateMachine.setState(STATES.ENEMY_TURN_START)
  }

  private $drawCard(player: TargetKeys, callback?: () => void): void {
    this.$deck[player].drawCard((card: Card | undefined) => {
      this.$hand[player].drawCard(card, callback)
    })
  }

  private $playCard(target: TargetKeys, card: Card, callback?: () => void) {
    const afterPlayCard = () => {
      this.$mana[target].useMana(card.card.cost)
      this.$board[target].playCard(card)
      callback?.()
    }

    this.$hand[target].playCard(card, () => {
      if (target === TARGET_KEYS.ENEMY) {
        // Opponent battlecry ->
        afterPlayCard()
        return
      }

      afterPlayCard()
    })
  }

  private $handleMana(player: TargetKeys, context: 'ADD' | 'REFRESH'): void {
    switch (context) {
      case 'ADD':
        this.$mana[player].addMana()
        break

      case 'REFRESH':
        this.$mana[player].refreshMana()
        break
    }
  }

  private $handleHand(player: TargetKeys, context: 'PLAYABLE'): void {
    switch (context) {
      case 'PLAYABLE':
        this.$hand[player].cards.forEach((card: Card) => {
          const canBePlayed = this.$mana[player].mana >= card.card.cost
          card.setPlayable(canBePlayed)
        })
        break
    }
  }

  private $createStateMachine(): void {
    // Game Flow States
    this.$stateMachine.addState({
      name: STATES.PLAYER_TURN_START,
      onEnter: () => {
        this.$handleMana(TARGET_KEYS.PLAYER, 'ADD')
        this.$handleMana(TARGET_KEYS.PLAYER, 'REFRESH')
        this.$stateMachine.setState(STATES.PLAYER_DRAW_CARD)
      },
    })

    this.$stateMachine.addState({
      name: STATES.ENEMY_TURN_START,
      onEnter: () => {
        this.$handleMana(TARGET_KEYS.ENEMY, 'ADD')
        this.$handleMana(TARGET_KEYS.ENEMY, 'REFRESH')
        this.$stateMachine.setState(STATES.ENEMY_DRAW_CARD)
      },
    })

    this.$stateMachine.addState({
      name: STATES.PLAYER_TURN,
      onEnter: () => {
        this.$handleHand(TARGET_KEYS.PLAYER, 'PLAYABLE')
      },
    })

    this.$stateMachine.addState({
      name: STATES.ENEMY_TURN,
      onEnter: () => {
        this.$handleHand(TARGET_KEYS.ENEMY, 'PLAYABLE')
        this.$enemyAI.opponentTurn()
      },
    })

    // Player States
    this.$stateMachine.addState({
      name: STATES.PLAYER_DRAW_CARD,
      onEnter: () => {
        this.$drawCard(TARGET_KEYS.PLAYER, () => {
          this.$stateMachine.setState(STATES.PLAYER_TURN)
        })
      },
    })

    this.$stateMachine.addState({
      name: STATES.PLAYER_PLAY_CARD,
      onEnter: (card: Card) => {
        this.$playCard(TARGET_KEYS.PLAYER, card, () => {
          this.$stateMachine.setState(STATES.PLAYER_TURN)
        })
      },
    })

    // Enemy States
    this.$stateMachine.addState({
      name: STATES.ENEMY_DRAW_CARD,
      onEnter: () => {
        this.$drawCard(TARGET_KEYS.ENEMY, () => {
          this.$stateMachine.setState(STATES.ENEMY_TURN)
        })
      },
    })

    this.$stateMachine.addState({
      name: STATES.ENEMY_PLAY_CARD,
      onEnter: (card: Card) => {
        this.$playCard(TARGET_KEYS.ENEMY, card, () => {
          this.$stateMachine.setState(STATES.ENEMY_TURN)
        })
      },
    })
  }
}
