import { warningMessage } from '../common/warning'
import { Board } from '../objects/board'
import { Card } from '../objects/card'
import { Hero } from '../objects/hero'
import { AnimationManager } from './animation-manager'
import { Battlecry } from './card-keys'
import { STATES, TARGET_KEYS, WARNING_KEYS } from './keys'
import { StateMachine } from './state-machine'

export class BattlecryManager {
  private $scene: Phaser.Scene
  private $stateMachine: StateMachine
  private $animationManager: AnimationManager
  private $board: { PLAYER: Board; ENEMY: Board }
  private $hero: { PLAYER: Hero; ENEMY: Hero }
  private $source: Card
  private $effect: Battlecry
  private $targetType: string
  private $target: Card | Hero
  private $callback?: () => void // Usually play the card
  private $fallback?: () => void

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

  public handleBattlecry(card: Card, callback?: () => void, fallback?: () => void): void {
    this.$source = card

    if (card.card.battlecry) {
      this.$effect = card.card.battlecry
      this.$targetType = card.card.battlecry.target
      this.$callback = callback
      this.$fallback = fallback

      if (this.$targetType === 'ANY') {
        const targets = [
          ...this.$board.PLAYER.cards,
          ...this.$board.ENEMY.cards,
          this.$hero.PLAYER,
          this.$hero.ENEMY,
        ]

        if (targets.length > 0) {
          if (card.player === TARGET_KEYS.PLAYER) {
            this.$stateMachine.setState(STATES.PLAYER_BATTLECRY_CHOOSE_TARGET, this.$targetType)
            return
          }

          const target = targets[Math.floor(Math.random() * targets.length)]
          this.targetChosen(target)
          return
        }
        callback?.()
        return
      }

      if (this.$targetType === 'RANDOM_ENEMY') {
        let targets = []
        this.$source.player === TARGET_KEYS.PLAYER
          ? (targets = [...this.$board.ENEMY.cards, this.$hero.ENEMY])
          : (targets = [...this.$board.PLAYER.cards, this.$hero.PLAYER])

        if (targets.length > 0) {
          const target = targets[Math.floor(Math.random() * targets.length)]
          this.targetChosen(target)
          return
        }

        callback?.()
        return
      }

      if (this.$targetType === 'RANDOM_FRIENDLY') {
        let targets = []
        this.$source.player === TARGET_KEYS.PLAYER
          ? (targets = [...this.$board.PLAYER.cards, this.$hero.PLAYER])
          : (targets = [...this.$board.ENEMY.cards, this.$hero.ENEMY])

        if (targets.length > 0) {
          const target = targets[Math.floor(Math.random() * targets.length)]
          this.targetChosen(target)
          return
        }

        callback?.()
        return
      }

      if (this.$targetType === 'RANDOM_ENEMY_MINION') {
        let targets = []
        this.$source.player === TARGET_KEYS.PLAYER
          ? (targets = [...this.$board.ENEMY.cards])
          : (targets = [...this.$board.PLAYER.cards])

        if (targets.length > 0) {
          const target = targets[Math.floor(Math.random() * targets.length)]
          this.targetChosen(target)
          return
        }

        callback?.()
        return
      }

      if (this.$targetType === 'RANDOM_FRIENDLY_MINION') {
        let targets = []
        this.$source.player === TARGET_KEYS.PLAYER
          ? (targets = [...this.$board.PLAYER.cards])
          : (targets = [...this.$board.ENEMY.cards])

        if (targets.length > 0) {
          const target = targets[Math.floor(Math.random() * targets.length)]
          this.targetChosen(target)
          return
        }

        callback?.()
        return
      }

      if (this.$targetType === 'ENEMY_HERO') {
        let targets = []
        this.$source.player === TARGET_KEYS.PLAYER
          ? (targets = [this.$hero.ENEMY])
          : (targets = [this.$hero.PLAYER])

        if (targets.length > 0) {
          const target = targets[Math.floor(Math.random() * targets.length)]
          this.targetChosen(target)
          return
        }

        callback?.()
        return
      }

      if (this.$targetType === 'FRIENDLY_HERO') {
        let targets = []
        this.$source.player === TARGET_KEYS.PLAYER
          ? (targets = [this.$hero.PLAYER])
          : (targets = [this.$hero.ENEMY])

        if (targets.length > 0) {
          const target = targets[Math.floor(Math.random() * targets.length)]
          this.targetChosen(target)
          return
        }

        callback?.()
        return
      }

      // Exhausted
      console.error(`[BattlecryManager:handleBattlecry] - No case for ${this.$targetType}`)
      return
    }

    callback?.()
  }

  public targetChosen(target: Card | Hero): void {
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

  private $checkValidTarget(target: Card | Hero): boolean {
    const targetType = this.$targetType

    // No target to choose manually
    if (
      targetType === 'RANDOM_ENEMY' ||
      targetType === 'RANDOM_FRIENDLY' ||
      targetType === 'RANDOM_ENEMY_MINION' ||
      targetType === 'RANDOM_FRIENDLY_MINION' ||
      targetType === 'ENEMY_HERO' ||
      targetType === 'FRIENDLY_HERO'
    ) {
      return true
    }

    if (targetType === 'ANY') {
      return true
    }

    warningMessage(this.$scene, WARNING_KEYS.NOT_VALID_TARGET)
    return false
  }

  private $dealDamage(target: Card | Hero): void {
    this.$animationManager.battlecryProjectile(
      this.$source,
      target,
      () => {
        const newHealth = (target instanceof Card ? target.card.health : target.health) - this.$effect.amount
        target.setHealth(newHealth)
      },
      this.$callback
    )
  }
}
