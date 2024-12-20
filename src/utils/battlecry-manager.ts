import { Board } from '../objects/board'
import { Card } from '../objects/card'
import { AnimationManager } from './animation-manager'
import { Battlecry } from './card-keys'
import { STATES } from './keys'
import { StateMachine } from './state-machine'

export class BattlecryManager {
  private $scene: Phaser.Scene
  private $stateMachine: StateMachine
  private $animationManager: AnimationManager
  private $board: { PLAYER: Board; ENEMY: Board }
  private $source: Card
  private $effect: Battlecry
  private $targetType: string
  private $target: Card
  private $callback?: () => void // Usually play the card
  private $fallback?: () => void

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

  public handleBattlecry(card: Card, callback?: () => void, fallback?: () => void): void {
    this.$source = card

    if (card.card.battlecry) {
      this.$effect = card.card.battlecry
      this.$targetType = card.card.battlecry.target
      this.$callback = callback
      this.$fallback = fallback

      if (this.$targetType === 'ANY') {
        const hasTargets = this.$board.PLAYER.cards.length > 0 && this.$board.ENEMY.cards.length > 0
        if (hasTargets) {
          this.$stateMachine.setState(STATES.PLAYER_CHOOSE_TARGET, this.$targetType)
          return
        }
        callback?.()
      }
      return
    }

    callback?.()
  }

  public targetChosen(target: Card): void {
    if (!this.$checkValidTarget(target)) {
      // Warn this is wrong target
      this.$fallback?.()
      return
    }

    this.$target = target

    if (this.$effect?.type === 'DAMAGE') {
      this.$dealDamage(target)
    }
  }

  private $checkValidTarget(target: Card): boolean {
    if (this.$targetType === 'ANY') {
      return true
    }

    return false
  }

  private $dealDamage(target: Card): void {
    this.$animationManager.battlecryProjectile(
      this.$source,
      target,
      () => {
        target.setHealth(target.card.health - this.$effect.amount)
      },
      this.$callback
    )
  }
}
