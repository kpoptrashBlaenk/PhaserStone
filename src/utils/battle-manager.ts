import { Board } from '../objects/board'
import { Card } from '../objects/card'
import { AnimationManager } from './animation-manager'
import { StateMachine } from './state-machine'

export class BattleManager {
  private $scene: Phaser.Scene
  private $stateMachine: StateMachine
  private $animationManager: AnimationManager
  private $board: { PLAYER: Board; ENEMY: Board }

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
          this.$board[card.player].cardDies(card, callback)
        })
      })
      return
    }

    callback?.()
  }
}
