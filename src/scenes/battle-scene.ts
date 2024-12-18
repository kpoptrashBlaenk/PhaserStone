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

  private $deck: { PLAYER: Deck; ENEMY: Deck } = { PLAYER: null as any, ENEMY: null as any }
  private $hand: { PLAYER: Hand; ENEMY: Hand } = { PLAYER: null as any, ENEMY: null as any }
  private $mana: { PLAYER: Mana; ENEMY: Mana } = { PLAYER: null as any, ENEMY: null as any }

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

    // Background
    new Background(this)

    // Deck
    this.$deck.PLAYER = new Deck(this, TARGET_KEYS.PLAYER, this.$animationManager)
    this.$deck.ENEMY = new Deck(this, TARGET_KEYS.ENEMY, this.$animationManager)

    // Hand
    this.$hand.PLAYER = new Hand(this, TARGET_KEYS.PLAYER, this.$animationManager)
    this.$hand.ENEMY = new Hand(this, TARGET_KEYS.ENEMY, this.$animationManager)

    // Mana
    this.$mana.PLAYER = new Mana(this, TARGET_KEYS.PLAYER)
    this.$mana.ENEMY = new Mana(this, TARGET_KEYS.ENEMY)

    // State Machine
    this.$stateMachine = new StateMachine('battle', this)
    this.$createStateMachine()

    this.$stateMachine.setState(STATES.PLAYER_TURN_START)
  }

  private $drawCard(player: TargetKeys): void {
    this.$deck[player].drawCard((card: Card | undefined) => {
      this.$hand[player].drawCard(card)
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

    // Player States
    this.$stateMachine.addState({
      name: STATES.PLAYER_DRAW_CARD,
      onEnter: () => {
        this.$drawCard(TARGET_KEYS.PLAYER)
      },
    })

    // Enemy States
    this.$stateMachine.addState({
      name: STATES.ENEMY_DRAW_CARD,
      onEnter: () => {
        this.$drawCard(TARGET_KEYS.ENEMY)
      },
    })
  }
}
