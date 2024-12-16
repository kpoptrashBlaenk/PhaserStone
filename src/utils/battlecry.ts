import { EFFECT_ASSET_KEYS } from '../assets/asset-keys'
import { Board } from '../gameObjects/board'
import { BoardCard } from '../gameObjects/card/board-card'
import { BattlecryMinion } from '../gameObjects/card/card-keys'
import { HandCard } from '../gameObjects/card/hand-card'
import { Hero } from '../gameObjects/hero'
import { BattleScene } from '../scenes/battle-scene'
import { BATTLE_STATES, TARGET_KEYS, TargetKeys, WARNING_KEYS } from './keys'
import { DAMAGE_CONFIGS, DEATH_CONFIGS } from './visual-configs'

export class Battlecry {
  private scene: BattleScene
  private board: {
    PLAYER: Board
    OPPONENT: Board
  }
  private source: HandCard
  private target: BoardCard | Hero
  private effect: BattlecryMinion | undefined
  private targetType: string
  private dead: (BoardCard | Hero)[]
  private callback?: () => void
  private fallback?: () => void

  constructor(scene: BattleScene, board: { PLAYER: Board; OPPONENT: Board }) {
    this.scene = scene
    this.board = board
    this.dead = []
  }

  public checkForEffect(card: HandCard, callback?: () => void, fallback?: () => void): void {
    this.source = card
    this.effect = card.cardData.battlecry
    this.callback = callback
    this.fallback = fallback

    if (card.cardData.battlecry) {
      this.targetType = card.cardData.battlecry?.target

      if (this.targetType === 'ANY') {
        this.scene.stateMachine.setState(BATTLE_STATES.PLAYER_CHOOSE_TARGET)
      }
    }
  }

  public targetChosen(target: BoardCard | Hero) {
    if (!this.checkValidTarget(target)) {
      this.scene.warnMessage.showTurnMessage(WARNING_KEYS.NOT_VALID_TARGET)
      this.fallback?.()
      return
    }

    this.target = target

    if (this.effect?.type === 'DAMAGE') {
      this.dealDamage(target)
    }
  }

  public afterEffectCheck(turn: TargetKeys): void {
    // Set turn state
    const setState = () => {
      this.cleanup()

      if (turn === TARGET_KEYS.PLAYER) {
        this.scene.stateMachine.setState(BATTLE_STATES.PLAYER_TURN)
      } else {
        this.scene.stateMachine.setState(BATTLE_STATES.OPPONENT_TURN)
      }
    }

    const defender = this.target

    if (defender) {
      const defenderHealth = defender.healthAmount

      // Check if defender died
      if (defenderHealth <= 0) {
        this.dead.push(defender)
      }

      if (this.dead.length > 0) {
        this.death(setState)
        return
      }

      // If no minions died, set states immediately
      setState()
    }
  }

  private checkValidTarget(target: BoardCard | Hero): boolean {
    if (this.targetType === 'ANY') {
      return true
    }

    return false
  }

  private dealDamage(target: BoardCard | Hero) {
    const sourceBounds = this.source.container.getBounds()
    const targetBounds = target.container.getBounds()

    const effect = this.scene.add
      .image(sourceBounds.centerX, sourceBounds.centerY, EFFECT_ASSET_KEYS.SPARK)
      .setScale(0.2)

    this.scene.tweens.add({
      targets: effect,
      x: targetBounds.centerX,
      y: targetBounds.centerY,
      duration: 200,
      ease: 'Sine.easeOut',
      onComplete: () => {
        effect.destroy()
        target.setHealthAmount = target.healthAmount - this.source.attackAmount

        // Flash effect
        this.scene.tweens.add({
          targets: target.container,
          alpha: DAMAGE_CONFIGS.FLASH.ALPHA,
          duration: DAMAGE_CONFIGS.FLASH.DURATION,
          yoyo: DAMAGE_CONFIGS.FLASH.YOYO,
          repeat: DAMAGE_CONFIGS.FLASH.REPEAT,
          onComplete: () => {
            this.scene.stateMachine.setState(BATTLE_STATES.AFTER_EFFECT_CHECK) // TODO: Wrong after battle check
            this.callback?.()
          },
        })

        // Particle effect
        this.scene.add.particles(
          target.container.getBounds().centerX,
          target.container.getBounds().centerY,
          EFFECT_ASSET_KEYS.SPARK,
          {
            scale: DAMAGE_CONFIGS.SPARK.SCALE,
            speed: DAMAGE_CONFIGS.SPARK.SPEED,
            lifespan: DAMAGE_CONFIGS.SPARK.LIFESPAN,
            gravityY: DAMAGE_CONFIGS.SPARK.GRAVITY_Y,
            duration: DAMAGE_CONFIGS.SPARK.DURATION,
          }
        )
      },
    })
  }

  /**
   * Death Animation: Shrink and fade out
   */
  private death(callback?: () => void): void {
    this.dead.forEach((card) => {
      card.image.setTint(DEATH_CONFIGS.TINT)

      if (card instanceof BoardCard) {
        card.template.setTint(DEATH_CONFIGS.TINT)
      }

      const { x, y } = {
        x: card instanceof BoardCard ? card.container.x + card.container.width / 2 : card.container.x,
        y: card instanceof BoardCard ? card.container.y + card.container.height / 2 : card.container.y,
      }

      // Shrink
      this.scene.tweens.add({
        x: x,
        y: y,
        delay: DEATH_CONFIGS.DELAY,
        targets: card.container,
        scale: DEATH_CONFIGS.SCALE,
        alpha: DEATH_CONFIGS.ALPHA,
        duration: DEATH_CONFIGS.DURATION,
        ease: DEATH_CONFIGS.EASE,
        onComplete: () => {
          if (card instanceof BoardCard) {
            this.board[card.player].cardDies(card, () => {
              callback?.()
            })
            return
          }

          if (card instanceof Hero) {
            this.scene.stateMachine.setState(BATTLE_STATES.GAME_END, card.player)
            return
          }
        },
      })
    })
  }

  /**
   * Cleanup Battle Manager
   */
  private cleanup(): void {
    this.dead = []
  }
}
