import { Card } from '../objects/card'
import { Battlecry } from './card-keys'
import { STATES } from './keys'
import { StateMachine } from './state-machine'

export class BattlecryManager {
  private $scene: Phaser.Scene
  private $stateMachine: StateMachine
  private $source: Card
  private $effect: Battlecry
  private $targetType: string
  private $target: Card
  private $callback?: () => void
  private $fallback?: () => void

  constructor(scene: Phaser.Scene, stateMachine: StateMachine) {
    this.$scene = scene
    this.$stateMachine = stateMachine
  }

  public handleBattlecry(card: Card, callback?: () => void, fallback?: () => void): void {
    this.$source = card

    if (card.card.battlecry) {
      this.$effect = card.card.battlecry
      this.$targetType = card.card.battlecry.target
      this.$callback = callback
      this.$fallback = fallback

      if (this.$targetType === 'ANY') {
        this.$stateMachine.setState(STATES.PLAYER_CHOOSE_TARGET, this.$targetType)
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

  private $dealDamage(target: Card) {
    this.$callback?.()
  }
}
