import { warningMessage } from '../common/warning'
import { Board } from '../objects/board'
import { Card } from '../objects/card'
import { Hero } from '../objects/hero'
import { AnimationManager } from './animation-manager'
import { Battlecry, BattlecryTarget } from '../utils/card-keys'
import { STATES, TARGET_KEYS, WARNING_KEYS } from '../utils/keys'
import { StateMachine } from '../utils/state-machine'

/**
 * The BattlecryManager class handles battlecries
 */
export class BattlecryManager {
  private $scene: Phaser.Scene
  private $stateMachine: StateMachine
  private $animationManager: AnimationManager
  private $board: { PLAYER: Board; ENEMY: Board }
  private $hero: { PLAYER: Hero; ENEMY: Hero }
  private $source: Card
  private $effect: Battlecry
  private $targetType: BattlecryTarget
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

  /**
   * Set battlecry choose target or target chosen depending on battlecry target value
   *
   * @param card {@link Card} with battlecry
   * @param callback Usually playCard()
   * @param fallback Usually remove cancel button and return card to hand
   */
  public handleBattlecry(card: Card, callback?: () => void, fallback?: () => void): void {
    this.$source = card

    if (!card.card.battlecry) {
      callback?.()
      return
    }

    this.$effect = card.card.battlecry
    this.$targetType = card.card.battlecry.target
    this.$callback = callback
    this.$fallback = fallback

    const board = this.$board
    const hero = this.$hero
    const player = this.$source.player
    const targetType = this.$targetType

    const getTargets = (type: BattlecryTarget): (Card | Hero)[] => {
      switch (type) {
        case 'ANY':
          return [...board.PLAYER.cards, ...board.ENEMY.cards, hero.PLAYER, hero.ENEMY]

        case 'ENEMY':
          return player === TARGET_KEYS.PLAYER
            ? [...board.ENEMY.cards, hero.ENEMY]
            : [...board.PLAYER.cards, hero.PLAYER]

        case 'FRIENDLY':
          return [...board[player].cards, hero[player]]

        case 'RANDOM_ENEMY':
          return player === TARGET_KEYS.PLAYER
            ? [...board.ENEMY.cards, hero.ENEMY]
            : [...board.PLAYER.cards, hero.PLAYER]

        case 'RANDOM_FRIENDLY':
          return [...board[player].cards, hero[player]]

        case 'RANDOM_ENEMY_MINION':
          return player === TARGET_KEYS.PLAYER ? [...board.ENEMY.cards] : [...board.PLAYER.cards]

        case 'RANDOM_FRIENDLY_MINION':
          return [...board[player].cards]

        case 'ENEMY_HERO':
          return player === TARGET_KEYS.PLAYER ? [hero.ENEMY] : [hero.PLAYER]

        case 'FRIENDLY_HERO':
          return [hero[player]]

        default:
          console.error(`[BattlecryManager:handleBattlecry] - No case for ${type}`)
          return []
      }
    }

    const targets = getTargets(targetType)

    if (targets.length > 0) {
      if (
        (targetType === 'ANY' || targetType === 'ENEMY' || targetType === 'FRIENDLY') &&
        card.player === TARGET_KEYS.PLAYER
      ) {
        this.$stateMachine.setState(STATES.PLAYER_BATTLECRY_CHOOSE_TARGET, targetType)
        return
      }

      const target = targets[Math.floor(Math.random() * targets.length)]
      this.targetChosen(target)
      return
    }

    callback?.()
  }

  /**
   * Check target validity and then do {@link $dealDamage} or {@link $healHealth} depending on {@link $effect}s type
   *
   * @param target Targeted {@link Card} or {@link Hero}
   */
  public targetChosen(target: Card | Hero): void {
    if (!this.$checkValidTarget(target)) {
      this.$fallback?.()
      return
    }

    if (this.$effect?.type === 'DAMAGE') {
      this.$dealDamage(target)
      return
    }

    if (this.$effect.type === 'HEAL') {
      this.$healHealth(target)
      return
    }
  }

  /**
   * Check if target is valid, if not show warning message
   *
   * @param target Targeted {@link Card} or {@link Hero}
   * @returns If target is valid
   */
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

    if (targetType === 'ENEMY') {
      if (this.$source.player !== target.player) {
        return true
      }
      warningMessage(this.$scene, WARNING_KEYS.NOT_VALID_TARGET)
      return false
    }

    if (targetType === 'FRIENDLY') {
      if (this.$source.player === target.player) {
        return true
      }
      warningMessage(this.$scene, WARNING_KEYS.NOT_VALID_TARGET)
      return false
    }

    // Exhaust
    warningMessage(this.$scene, WARNING_KEYS.NOT_VALID_TARGET)
    return false
  }

  /**
   * Deal damage to the target by using animation managers battlecryDamage()
   *
   * @param target Targeted {@link Card} or {@link Hero}
   */
  private $dealDamage(target: Card | Hero): void {
    this.$animationManager.battlecryDamage(
      this.$source,
      target,
      () => {
        const newHealth = (target instanceof Card ? target.card.health : target.health) - this.$effect.amount
        target.setHealth(newHealth)
      },
      this.$callback
    )
  }

  /**
   * Heal health to the target by using animation managers battlecryHeal()
   *
   * @param target Targeted {@link Card} or {@link Hero}
   */
  private $healHealth(target: Card | Hero): void {
    this.$animationManager.battlecryHeal(
      this.$source,
      target,
      () => {
        const newHealth =
          target instanceof Card
            ? Math.min(target.card.health + this.$effect.amount, target.original.health)
            : Math.min(target.health + this.$effect.amount, target.maxHealth)

        target.setHealth(newHealth)
      },
      this.$callback
    )
  }
}
