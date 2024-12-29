import { EnemyAI } from '../common/enemy-ai'
import { Board } from '../objects/board'
import { Card } from '../objects/card'
import { Deck } from '../objects/deck'
import { Hand } from '../objects/hand'
import { Mana } from '../objects/mana'
import { Background } from '../ui/background'
import { TurnButton } from '../ui/turn-button'
import { AnimationManager } from '../utils/animation-manager'
import { STATES, TARGET_KEYS, TargetKeys } from '../utils/keys'
import { StateMachine } from '../utils/state-machine'
import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'
import { BattlecryManager } from '../utils/battlecry-manager'
import { BattleManager } from '../utils/battle-manager'
import { IdCounter } from '../utils/id-counter'

export class BattleScene extends BaseScene {
  private $animationManager: AnimationManager
  private $battlecryManager: BattlecryManager
  private $battleManager: BattleManager
  private $stateMachine: StateMachine
  private $enemyAI: EnemyAI
  private $turnButton: TurnButton
  private $idCounter: IdCounter

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

    // State Machine
    this.$stateMachine = new StateMachine('battle', this)
    this.$createStateMachine()

    // Animation Manager
    this.$animationManager = new AnimationManager(this)

    // Id Counter
    this.$idCounter = new IdCounter()

    // Background
    new Background(this)

    // Turn Button
    this.$turnButton = new TurnButton(this, this.$stateMachine)

    // Deck
    this.$deck.PLAYER = new Deck(this, this.$stateMachine, TARGET_KEYS.PLAYER, this.$animationManager, this.$idCounter)
    this.$deck.ENEMY = new Deck(this, this.$stateMachine, TARGET_KEYS.ENEMY, this.$animationManager, this.$idCounter)

    // Hand
    this.$hand.PLAYER = new Hand(this, TARGET_KEYS.PLAYER, this.$animationManager)
    this.$hand.ENEMY = new Hand(this, TARGET_KEYS.ENEMY, this.$animationManager)

    // Mana
    this.$mana.PLAYER = new Mana(this, TARGET_KEYS.PLAYER)
    this.$mana.ENEMY = new Mana(this, TARGET_KEYS.ENEMY)

    // Board
    this.$board.PLAYER = new Board(this, TARGET_KEYS.PLAYER, this.$animationManager)
    this.$board.ENEMY = new Board(this, TARGET_KEYS.ENEMY, this.$animationManager)

    // Battlecry Manager
    this.$battlecryManager = new BattlecryManager(
      this,
      this.$stateMachine,
      this.$animationManager,
      this.$board
    )

    // Battle Manager
    this.$battleManager = new BattleManager(this, this.$stateMachine, this.$animationManager, this.$board)

    this.$enemyAI = new EnemyAI(this, this.$stateMachine, this.$hand.ENEMY, this.$board)

    this.$turnButton.changeTurn()
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
        if (card.card.battlecry) {
          this.$battlecryManager.handleBattlecry(card, afterPlayCard)
          return
        }
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

  private $handleHand(player: TargetKeys, context: 'PLAYABLE' | 'RESET'): void {
    switch (context) {
      case 'PLAYABLE':
        this.$hand[player].cards.forEach((card: Card) => {
          const canBePlayed =
            this.$mana[player].mana >= card.card.cost && this.$board[player].cards.length < 7
          card.setPlayable(canBePlayed)
        })
        break
      case 'RESET':
        this.$hand[player].cards.forEach((card: Card) => {
          card.setOutline(false)
        })
        break
    }
  }

  private $handleBoard(player: TargetKeys, context: 'RESET' | 'ATTACKABLE'): void {
    switch (context) {
      case 'RESET':
        this.$board[player].cards.forEach((card: Card) => {
          card.setSick(false)
        })
        this.$board[player].cards.forEach((card: Card) => {
          card.setAttacked(false)
        })
        this.$board[player].cards.forEach((card: Card) => {
          card.setOutline(false)
        })
        break
      case 'ATTACKABLE':
        this.$board[player].cards.forEach((card: Card) => {
          card.setOutline(card.canAttack)
        })
        break
    }
  }

  private $setTargets(target: 'NONE' | 'ANY' | 'ENEMY'): void {
    switch (target) {
      case 'NONE':
        this.$board.PLAYER.cards.forEach((card: Card) => {
          card.setTarget(false)
        })
        this.$board.ENEMY.cards.forEach((card: Card) => {
          card.setTarget(false)
        })
        break
      case 'ANY':
        this.$board.PLAYER.cards.forEach((card: Card) => {
          card.setTarget(true)
        })
        this.$board.ENEMY.cards.forEach((card: Card) => {
          card.setTarget(true)
        })
        break
      case 'ENEMY':
        this.$board.ENEMY.cards.forEach((card: Card) => {
          card.setTarget(true)
        })
        break
    }
  }

  private $createStateMachine(): void {
    // Game Flow States
    this.$stateMachine.addState({
      name: STATES.TURN_BUTTON,
      onEnter: () => {
        this.$turnButton.changeTurn()
      },
    })

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
        this.$handleBoard(TARGET_KEYS.PLAYER, 'ATTACKABLE')
        this.$setTargets('NONE')
      },
    })

    this.$stateMachine.addState({
      name: STATES.ENEMY_TURN,
      onEnter: () => {
        this.$handleHand(TARGET_KEYS.ENEMY, 'PLAYABLE')
        this.$handleBoard(TARGET_KEYS.ENEMY, 'ATTACKABLE')
        this.$enemyAI.opponentTurn()
      },
    })

    this.$stateMachine.addState({
      name: STATES.PLAYER_TURN_END,
      onEnter: () => {
        this.$handleHand(TARGET_KEYS.PLAYER, 'RESET')
        this.$handleBoard(TARGET_KEYS.PLAYER, 'RESET')

        this.$stateMachine.setState(STATES.ENEMY_TURN_START)
      },
    })

    this.$stateMachine.addState({
      name: STATES.ENEMY_TURN_END,
      onEnter: () => {
        this.$handleHand(TARGET_KEYS.ENEMY, 'RESET')
        this.$handleBoard(TARGET_KEYS.ENEMY, 'RESET')

        this.$stateMachine.setState(STATES.PLAYER_TURN_START)
      },
    })

    this.$stateMachine.addState({
      name: STATES.CHECK_BOARD,
      onEnter: (callback?: () => void) => {
        this.$battleManager.checkDead(callback)
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
          this.$stateMachine.setState(STATES.CHECK_BOARD, () => {
            this.$stateMachine.setState(STATES.PLAYER_TURN)
          })
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
          this.$stateMachine.setState(STATES.CHECK_BOARD, () => {
            this.$stateMachine.setState(STATES.ENEMY_TURN)
          })
        })
      },
    })

    // Battlecry States
    this.$stateMachine.addState({
      name: STATES.PLAYER_BATTLECRY,
      onEnter: ({
        card,
        callback,
        fallback,
      }: {
        card: Card
        callback?: () => void
        fallback?: () => void
      }) => {
        this.$battlecryManager.handleBattlecry(card, callback, fallback)
      },
    })

    this.$stateMachine.addState({
      name: STATES.PLAYER_BATTLECRY_CHOOSE_TARGET,
      onEnter: (target: 'NONE' | 'ANY' | 'ENEMY') => {
        this.$setTargets(target)
      },
    })

    this.$stateMachine.addState({
      name: STATES.PLAYER_BATTLECRY_TARGET_CHOSEN,
      onEnter: (target: Card) => {
        this.$setTargets('NONE')
        this.$battlecryManager.targetChosen(target)
      },
    })

    // Battle States
    this.$stateMachine.addState({
      name: STATES.PLAYER_BATTLE_CHOOSE_TARGET,
      onEnter: ({ card, cancelButton }: { card: Card; cancelButton: Phaser.GameObjects.Image }) => {
        this.$setTargets('ENEMY')
        this.$battleManager.handleBattle(card, cancelButton)
      },
    })

    this.$stateMachine.addState({
      name: STATES.PLAYER_BATTLE_TARGET_CHOSEN,
      onEnter: (target: Card) => {
        this.$setTargets('NONE')
        this.$battleManager.targetChosen(target)
      },
    })
  }
}
