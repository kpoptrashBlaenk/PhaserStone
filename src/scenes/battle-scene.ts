import { DATA_ASSET_KEYS } from '../assets/asset-keys'
import { EnemyAI } from '../common/enemy-ai'
import { Board } from '../objects/board'
import { Card } from '../objects/card'
import { Deck } from '../objects/deck'
import { Hand } from '../objects/hand'
import { Hero } from '../objects/hero'
import { Mana } from '../objects/mana'
import { Background } from '../ui/background'
import { TurnButton } from '../ui/turn-button'
import { AnimationManager } from '../managers/animation-manager'
import { BattleManager } from '../managers/battle-manager'
import { BattlecryManager } from '../managers/battlecry-manager'
import { CardData } from '../utils/card-keys'
import { STATES, TARGET_KEYS, TargetKeys } from '../utils/keys'
import { StateMachine } from '../utils/state-machine'
import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'

/**
 * BattleScene extends {@link BaseScene}
 *
 * This scene handles the all actions in a battle.
 */
export class BattleScene extends BaseScene {
  private $animationManager: AnimationManager
  private $battlecryManager: BattlecryManager
  private $battleManager: BattleManager
  private $stateMachine: StateMachine
  private $enemyAI: EnemyAI
  private $turnButton: TurnButton
  private $selectedCards: CardData[]

  private $deck: { PLAYER: Deck; ENEMY: Deck } = { PLAYER: null as any, ENEMY: null as any }
  private $hand: { PLAYER: Hand; ENEMY: Hand } = { PLAYER: null as any, ENEMY: null as any }
  private $mana: { PLAYER: Mana; ENEMY: Mana } = { PLAYER: null as any, ENEMY: null as any }
  private $board: { PLAYER: Board; ENEMY: Board } = { PLAYER: null as any, ENEMY: null as any }
  private $hero: { PLAYER: Hero; ENEMY: Hero } = { PLAYER: null as any, ENEMY: null as any }

  constructor() {
    super({
      key: SCENE_KEYS.BATTLE_SCENE,
    })
  }

  /**
   * Scene initialization with data.
   *
   * @param data An array of {@link CardData} that will become the players deck.
   */
  init(data: { deck: CardData[] }): void {
    super.init()

    this.$selectedCards = data.deck
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

    // Background
    new Background(this)

    // Turn Button
    this.$turnButton = new TurnButton(this, this.$stateMachine)

    // Deck
    this.$deck.PLAYER = new Deck(
      this,
      this.$stateMachine,
      TARGET_KEYS.PLAYER,
      this.$animationManager,
      this.$selectedCards
    )
    this.$deck.ENEMY = new Deck(
      this,
      this.$stateMachine,
      TARGET_KEYS.ENEMY,
      this.$animationManager,
      this.cache.json.get(DATA_ASSET_KEYS.CARDS)
    )

    // Hand
    this.$hand.PLAYER = new Hand(this, TARGET_KEYS.PLAYER, this.$animationManager)
    this.$hand.ENEMY = new Hand(this, TARGET_KEYS.ENEMY, this.$animationManager)

    // Mana
    this.$mana.PLAYER = new Mana(this, TARGET_KEYS.PLAYER)
    this.$mana.ENEMY = new Mana(this, TARGET_KEYS.ENEMY)

    // Hero
    this.$hero.PLAYER = new Hero(this, this.$stateMachine, TARGET_KEYS.PLAYER)
    this.$hero.ENEMY = new Hero(this, this.$stateMachine, TARGET_KEYS.ENEMY)

    // Board
    this.$board.PLAYER = new Board(this, TARGET_KEYS.PLAYER, this.$animationManager)
    this.$board.ENEMY = new Board(this, TARGET_KEYS.ENEMY, this.$animationManager)

    // Battlecry Manager
    this.$battlecryManager = new BattlecryManager(
      this,
      this.$stateMachine,
      this.$animationManager,
      this.$board,
      this.$hero
    )

    // Battle Manager
    this.$battleManager = new BattleManager(
      this,
      this.$stateMachine,
      this.$animationManager,
      this.$board,
      this.$hero
    )

    // Enemy Ai
    this.$enemyAI = new EnemyAI(this.$stateMachine, this.$hand.ENEMY, this.$board, this.$hero)

    // Start first turn
    this.$turnButton.changeTurn()
  }

  /**
   * Player draws a card from deck with {@link Deck.drawCard()} followed by placing it into the hand with {@link Hand.drawCard()} followed by the callback.
   *
   * @param player Player to draw card
   * @param callback Sets state to either {@link STATES.PLAYER_TURN} or {@link STATES.ENEMY_TURN}
   */
  private $drawCard(player: TargetKeys, callback: () => void): void {
    this.$deck[player].drawCard((card: Card | undefined) => {
      this.$hand[player].drawCard(card, callback)
    })
  }

  /**
   * Play card from hand with {@link Hand.playCard()}
   *
   * @param target Player that plays the card
   * @param card The {@link Card} played
   * @param callback Sets state to {@link STATES.CHECK_BOARD} then to either {@link STATES.PLAYER_TURN} or {@link STATES.ENEMY_TURN}
   */
  private $playCard(target: TargetKeys, card: Card, callback: () => void) {
    // Use mana then place the card onto the board and execute the afterCallback which removes card from hand and resizes it then set states
    const afterPlayCard = (afterCallback: () => void) => {
      this.$mana[target].useMana(card.card.cost)
      this.$board[target].playCard(card)
      afterCallback()
      callback()
    }

    // Play card from hand and handle battlecry if it's the enemies' turn
    // playCardCallback is a variable that Hand.playCard() modifies which is then being passed into afterPlayCard()
    this.$hand[target].playCard(card, (playCardCallback: () => void) => {
      if (target === TARGET_KEYS.ENEMY) {
        if (card.card.battlecry) {
          this.$battlecryManager.handleBattlecry(card, () => afterPlayCard(playCardCallback))
          return
        }
      }

      afterPlayCard(playCardCallback)
    })
  }

  /**
   * Add a new mana crystal or refresh the mana for selected player.
   *
   * @param player Players' {@link Mana} affected
   * @param context ADD: {@link Mana.addMana()}, REFRESH: {@link Mana.refreshMana()}
   */
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

  /**
   * If a card is playable add an outline and if not, remove it, for reset, remove all outlines.
   *
   * @param player Players' {@link Hand} affected
   * @param context PLAYABLE: Check if {@link Card} playable, RESET: Make all {@link Card} unplayable
   */
  private $handleHand(player: TargetKeys, context: 'PLAYABLE' | 'RESET'): void {
    switch (context) {
      case 'PLAYABLE':
        this.$hand[player].cards.forEach((card: Card) => {
          // Check if enough mana or if less than 7 cards on board
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

  /**
   * If a card can attack add an outline and if not, remove it, for reset, remove all outlines.
   *
   * @param player Players' {@link Board} affected
   * @param context ATTACKABLE: Check what {@link Card} and {@link Hero} can attack, RESET: Make all {@link Card} and {@link Hero} not being able to attack
   */
  private $handleBoard(player: TargetKeys, context: 'RESET' | 'ATTACKABLE'): void {
    const boardCards = this.$board[player].cards
    const hero = this.$hero[player]

    switch (context) {
      case 'ATTACKABLE': // it's more "who can attack then set outline"
        boardCards.forEach((card: Card) => {
          card.setOutline(card.canAttack)
        })

        hero.setOutline(hero.canAttack)
        break

      case 'RESET':
        boardCards.forEach((card: Card) => {
          card.setSick(false)
        })
        boardCards.forEach((card: Card) => {
          card.setAttacked(false)
        })
        boardCards.forEach((card: Card) => {
          card.setOutline(false)
        })

        hero.setAttacked(false)
        hero.setOutline(false)
        break
    }
  }

  /**
   * Set red tint for targets.
   *
   * @param target The targetable characters
   */
  private $setTargets(target: 'NONE' | 'ANY' | 'ENEMY' | 'FRIENDLY'): void {
    const playerBoard = this.$board.PLAYER.cards
    const enemyBoard = this.$board.ENEMY.cards
    const playerHero = this.$hero.PLAYER
    const enemyHero = this.$hero.ENEMY

    switch (target) {
      case 'NONE':
        playerBoard.forEach((card: Card) => {
          card.setTarget(false)
        })
        enemyBoard.forEach((card: Card) => {
          card.setTarget(false)
        })

        playerHero.setTarget(false)
        enemyHero.setTarget(false)
        break

      case 'ANY':
        playerBoard.forEach((card: Card) => {
          card.setTarget(true)
        })
        enemyBoard.forEach((card: Card) => {
          card.setTarget(true)
        })

        playerHero.setTarget(true)
        enemyHero.setTarget(true)
        break

      case 'ENEMY':
        enemyBoard.forEach((card: Card) => {
          card.setTarget(true)
        })
        enemyHero.setTarget(true)
        break

      case 'FRIENDLY':
        playerBoard.forEach((card: Card) => {
          card.setTarget(true)
        })

        playerHero.setTarget(true)
        break
    }
  }

  /**
   * Create the big ass state machine
   */
  private $createStateMachine(): void {
    //  ### Game Flow States ###

    // Change turn
    this.$stateMachine.addState({
      name: STATES.TURN_BUTTON,
      onEnter: () => {
        this.$turnButton.changeTurn()
      },
    })

    // Add a mana crystal, Refresh the mana, Set state to PLAYER_DRAW_CARD
    this.$stateMachine.addState({
      name: STATES.PLAYER_TURN_START,
      onEnter: () => {
        this.$handleMana(TARGET_KEYS.PLAYER, 'ADD')
        this.$handleMana(TARGET_KEYS.PLAYER, 'REFRESH')
        this.$stateMachine.setState(STATES.PLAYER_DRAW_CARD)
      },
    })

    // Add a mana crystal, Refresh the mana, Set state to ENEMY_DRAW_CARD
    this.$stateMachine.addState({
      name: STATES.ENEMY_TURN_START,
      onEnter: () => {
        this.$handleMana(TARGET_KEYS.ENEMY, 'ADD')
        this.$handleMana(TARGET_KEYS.ENEMY, 'REFRESH')
        this.$stateMachine.setState(STATES.ENEMY_DRAW_CARD)
      },
    })

    // Looped State
    // Check what cards can be played, Check what cards can attack, Reset all targets
    this.$stateMachine.addState({
      name: STATES.PLAYER_TURN,
      onEnter: () => {
        this.$handleHand(TARGET_KEYS.PLAYER, 'PLAYABLE')
        this.$handleBoard(TARGET_KEYS.PLAYER, 'ATTACKABLE')
        this.$setTargets('NONE')
      },
    })

    // Looped state
    // Check what cards can be played, Check what cards can attack, Let EnemyAI handle actions
    this.$stateMachine.addState({
      name: STATES.ENEMY_TURN,
      onEnter: () => {
        // Delay because enemy is too fast
        setTimeout(() => {
          this.$handleHand(TARGET_KEYS.ENEMY, 'PLAYABLE')
          this.$handleBoard(TARGET_KEYS.ENEMY, 'ATTACKABLE')
          this.$enemyAI.opponentTurn()
        }, 200)
      },
    })

    // Set all cards in hand unplayable, Set all cards on board unable to attack, Set state to ENEMY_TURN_START
    this.$stateMachine.addState({
      name: STATES.PLAYER_TURN_END,
      onEnter: () => {
        this.$handleHand(TARGET_KEYS.PLAYER, 'RESET')
        this.$handleBoard(TARGET_KEYS.PLAYER, 'RESET')

        this.$stateMachine.setState(STATES.ENEMY_TURN_START)
      },
    })

    // Set all cards in hand unplayable, Set all cards on board unable to attack, Set state to ENEMY_TURN_START
    this.$stateMachine.addState({
      name: STATES.ENEMY_TURN_END,
      onEnter: () => {
        this.$handleHand(TARGET_KEYS.ENEMY, 'RESET')
        this.$handleBoard(TARGET_KEYS.ENEMY, 'RESET')

        this.$stateMachine.setState(STATES.PLAYER_TURN_START)
      },
    })

    // Check if cards died, callback is setting the state to either PLAYER_TURN or ENEMY_TURN
    this.$stateMachine.addState({
      name: STATES.CHECK_BOARD,
      onEnter: (callback: () => void) => {
        this.$battleManager.checkDead(callback)
      },
    })

    // Game ended
    this.$stateMachine.addState({
      name: STATES.GAME_END,
      onEnter: () => {
        // GAME END
      },
    })

    // ### Player States ###

    // Draw a card, Set state to PLAYER_TURN
    this.$stateMachine.addState({
      name: STATES.PLAYER_DRAW_CARD,
      onEnter: () => {
        this.$drawCard(TARGET_KEYS.PLAYER, () => {
          this.$stateMachine.setState(STATES.PLAYER_TURN)
        })
      },
    })

    // Play passed card, Check board, Set state to PLAYER_TURN
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

    // ### Enemy States ###

    // Draw a card, Set state to ENEMY_TURN
    this.$stateMachine.addState({
      name: STATES.ENEMY_DRAW_CARD,
      onEnter: () => {
        this.$drawCard(TARGET_KEYS.ENEMY, () => {
          this.$stateMachine.setState(STATES.ENEMY_TURN)
        })
      },
    })

    // Play passed card, Check board, Set state to ENEMY_TURN
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

    // ### Battlecry States ###

    // source: Card, callback: Play card, fallback: Cancel play card
    // Handle the battlecry
    this.$stateMachine.addState({
      name: STATES.PLAYER_BATTLECRY,
      onEnter: ({
        source,
        callback,
        fallback,
      }: {
        source: Card
        callback?: () => void
        fallback?: () => void
      }) => {
        this.$battlecryManager.handleBattlecry(source, callback, fallback)
      },
    })

    // Set targets tint
    this.$stateMachine.addState({
      name: STATES.PLAYER_BATTLECRY_CHOOSE_TARGET,
      onEnter: (target: 'NONE' | 'ANY' | 'ENEMY' | 'FRIENDLY') => {
        this.$setTargets(target)
      },
    })

    // Reset targets, Pass target to BattlecryManager
    this.$stateMachine.addState({
      name: STATES.PLAYER_BATTLECRY_TARGET_CHOSEN,
      onEnter: (target: Card | Hero) => {
        this.$setTargets('NONE')
        this.$battlecryManager.targetChosen(target)
      },
    })

    // ### Battle States ###

    // Set targets tint then prepare battle manager
    this.$stateMachine.addState({
      name: STATES.PLAYER_BATTLE_CHOOSE_TARGET,
      onEnter: ({
        attacker,
        cancelButton,
      }: {
        attacker: Card | Hero
        cancelButton: Phaser.GameObjects.Image
      }) => {
        this.$setTargets('ENEMY')
        this.$battleManager.handleBattle(attacker, cancelButton)
      },
    })

    // Remove target tint then handle battle
    this.$stateMachine.addState({
      name: STATES.PLAYER_BATTLE_TARGET_CHOSEN,
      onEnter: (target: Card) => {
        this.$setTargets('NONE')
        this.$battleManager.targetChosen(target)
      },
    })

    // Prepare battle manager for enemy
    this.$stateMachine.addState({
      name: STATES.ENEMY_BATTLE_CHOOSE_TARGET,
      onEnter: (card: Card | Hero) => {
        this.$battleManager.handleBattle(card)
      },
    })

    // Handle battle for enemy
    this.$stateMachine.addState({
      name: STATES.ENEMY_BATTLE_TARGET_CHOSEN,
      onEnter: (target: Card | Hero) => {
        this.$battleManager.targetChosen(target)
      },
    })
  }
}
