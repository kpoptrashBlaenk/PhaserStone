import { Board } from '../objects/board'
import { Card } from '../objects/card'
import { Hero } from '../objects/hero'
import { AnimationManager } from './animation-manager'
import { STATES, TARGET_KEYS } from './keys'
import { StateMachine } from './state-machine'
import { ANIMATION_CONFIG } from './visual-configs'

export class BattleManager {
  private $scene: Phaser.Scene
  private $stateMachine: StateMachine
  private $animationManager: AnimationManager
  private $board: { PLAYER: Board; ENEMY: Board }
  private $attacker: Card | Hero
  private $defender: Card | Hero
  private $callback?: () => void // remove cancel

  constructor(
    scene: Phaser.Scene,
    stateMachine: StateMachine,
    animationManager: AnimationManager,
    board: { PLAYER: Board; ENEMY: Board }
  ) {
    this.$scene = scene
    this.$stateMachine = stateMachine
    this.$animationManager = animationManager
    this.$board = board
  }

  public checkDead(callback?: () => void): void {
    const dead: Card[] = []

    this.$board.PLAYER.cards.forEach((card: Card) => {
      if (card.card.health <= 0) {
        dead.push(card)
      }
    })

    this.$board.ENEMY.cards.forEach((card: Card) => {
      if (card.card.health <= 0) {
        dead.push(card)
      }
    })

    if (dead.length > 0) {
      dead.forEach((card: Card) => {
        this.$animationManager.death(card, () => {
          this.$board[card.player].cardDies(card)
        })
      })
    }

    setTimeout(() => callback?.(), ANIMATION_CONFIG.DEATH.DURATION)
  }

  public handleBattle(attacker: Card | Hero, cancelButton?: Phaser.GameObjects.Image): void {
    this.$attacker = attacker

    if (cancelButton) {
      this.$callback = () => cancelButton.destroy()
    }
  }

  public targetChosen(target: Card | Hero): void {
    this.$defender = target

    if (!this.$checkValidTarget(target)) {
      // Warn this is wrong target
      this.$callback?.()
      this.$stateMachine.setState(STATES.PLAYER_TURN)
      return
    }

    this.$battle()
  }

  private $checkValidTarget(target: Card | Hero): boolean {
    if (!(this.$attacker.player === target.player)) {
      return true
    }

    return false
  }

  private $battle(): void {
    this.$board[this.$attacker.player].setDepth(1)
    this.$callback?.()

    this.$animationManager.attack(
      this.$attacker,
      this.$defender,
      () => {
        const attacker = this.$attacker
        const defender = this.$defender

        const attackerHealth = attacker instanceof Card ? attacker.card.health : attacker.health
        const defenderHealth = defender instanceof Card ? defender.card.health : defender.health
        const attackerAttack = attacker instanceof Card ? attacker.card.attack : attacker.attack
        const defenderAttack = defender instanceof Card ? defender.card.attack : 0

        this.$attacker.setHealth(attackerHealth - defenderAttack)
        this.$defender.setHealth(defenderHealth - attackerAttack)
      },
      () => {
        this.$board[this.$attacker.player].setDepth(0)
        const state = this.$attacker.player === TARGET_KEYS.PLAYER ? STATES.PLAYER_TURN : STATES.ENEMY_TURN
        this.$stateMachine.setState(STATES.CHECK_BOARD, () => this.$stateMachine.setState(state))
      }
    )
  }
}
