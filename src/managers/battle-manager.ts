import { warningMessage } from '../common/warning'
import { Board } from '../objects/board'
import { Card } from '../objects/card'
import { Hero } from '../objects/hero'
import { AnimationManager } from './animation-manager'
import { STATES, TARGET_KEYS, TargetKeys, WARNING_KEYS } from '../utils/keys'
import { StateMachine } from '../utils/state-machine'
import { ANIMATION_CONFIG } from '../utils/visual-configs'

/**
 * The BattleManager class handles battles
 */
export class BattleManager {
  private $scene: Phaser.Scene
  private $stateMachine: StateMachine
  private $animationManager: AnimationManager
  private $board: { PLAYER: Board; ENEMY: Board }
  private $hero: { PLAYER: Hero; ENEMY: Hero }
  private $attacker: Card | Hero
  private $defender: Card | Hero
  private $callback?: () => void // remove cancel

  constructor(
    scene: Phaser.Scene,
    stateMachine: StateMachine,
    animationManager: AnimationManager,
    board: { PLAYER: Board; ENEMY: Board },
    hero: { PLAYER: Hero; ENEMY: Hero }
  ) {
    this.$scene = scene
    this.$stateMachine = stateMachine
    this.$animationManager = animationManager
    this.$board = board
    this.$hero = hero
  }

  /**
   * Check dead cards and heroes then animate death
   *
   * @param callback State after board is checked
   */
  public checkDead(callback?: () => void): void {
    const dead: (Card | Hero)[] = []

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

    if (this.$hero.PLAYER.health <= 0) {
      dead.push(this.$hero.PLAYER)
    }

    if (this.$hero.ENEMY.health <= 0) {
      dead.push(this.$hero.ENEMY)
    }

    if (dead.length > 0) {
      dead.forEach((card: Card | Hero) => {
        this.$animationManager.death(card, () => {
          card instanceof Card ? this.$board[card.player].cardDies(card) : this.$gameEnd(card.player)
        })
      })
    }

    setTimeout(() => {
      // If hero died don't callback
      if (dead.some((item) => item instanceof Hero)) {
        return
      }

      callback?.()
    }, ANIMATION_CONFIG.DEATH.DURATION)
  }

  /**
   * Set {@link attacker} and remove cancel button
   *
   * @param attacker {@link Card} or {@link Hero} that attacks
   * @param cancelButton The cancel button to handle
   */
  public handleBattle(attacker: Card | Hero, cancelButton?: Phaser.GameObjects.Image): void {
    this.$attacker = attacker

    if (cancelButton) {
      this.$callback = () => cancelButton.destroy()
    }
  }

  /**
   * Set {@link $defender} and check if target is valid {@link $battle()} if not the callback and set player turn
   *
   * @param target {@link Card} or {@link Hero} is being attacked
   */
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

  /**
   * Show end game message and set game end state
   *
   * @param loserPlayer {@link TargetKeys} of player that lost
   */
  private $gameEnd(loserPlayer: TargetKeys): void {
    const message = loserPlayer === TARGET_KEYS.PLAYER ? 'You lost!' : 'You won!'

    this.$animationManager.gameEnd(message, () => this.$stateMachine.setState(STATES.GAME_END))
  }

  /**
   * Check if target is valid, if not show warning message
   *
   * @param target Targeted {@link Card} or {@link Hero}
   * @returns If target is valid
   */
  private $checkValidTarget(target: Card | Hero): boolean {
    if (!(this.$attacker.player === target.player)) {
      return true
    }

    warningMessage(this.$scene, WARNING_KEYS.NOT_VALID_TARGET)
    return false
  }

  /**
   * Call animation managers attack() by passing an damage handler and pass check board state into player/enemy turn state as callback
   */
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
