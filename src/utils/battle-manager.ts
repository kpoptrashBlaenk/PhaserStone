import { Board } from '../objects/board'
import { Card } from '../objects/card'
import { AnimationManager } from './animation-manager'
import { STATES, TARGET_KEYS } from './keys'
import { StateMachine } from './state-machine'
import { ANIMATION_CONFIG } from './visual-configs'

export class BattleManager {
  private $scene: Phaser.Scene
  private $stateMachine: StateMachine
  private $animationManager: AnimationManager
  private $board: { PLAYER: Board; ENEMY: Board }
  private $attacker: Card
  private $defender: Card
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

  public handleBattle(card: Card, cancelButton?: Phaser.GameObjects.Image): void {
    this.$attacker = card

    if (cancelButton) {
      this.$callback = () => cancelButton.destroy()
    }
  }

  public targetChosen(target: Card): void {
    this.$defender = target

    if (!this.$checkValidTarget(target)) {
      // Warn this is wrong target
      this.$callback?.()
      this.$stateMachine.setState(STATES.PLAYER_TURN)
      return
    }

    this.$battle()
  }

  private $checkValidTarget(target: Card): boolean {
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
        const attackerHealth = this.$attacker.card.health - this.$defender.card.attack
        this.$attacker.setHealth(attackerHealth)

        const defenderHealth = this.$defender.card.health - this.$attacker.card.attack
        this.$defender.setHealth(defenderHealth)
      },
      () => {
        this.$board[this.$attacker.player].setDepth(0)
        const state = this.$attacker.player === TARGET_KEYS.PLAYER ? STATES.PLAYER_TURN : STATES.ENEMY_TURN
        this.$stateMachine.setState(STATES.CHECK_BOARD, () => this.$stateMachine.setState(state))
      }
    )
  }
}