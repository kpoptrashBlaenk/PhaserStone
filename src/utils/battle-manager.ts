import { EFFECT_ASSET_KEYS, UI_ASSET_KEYS } from '../assets/asset-keys'
import { Board } from '../gameObjects/board'
import { BoardCard } from '../gameObjects/card/board-card'
import { Hero } from '../gameObjects/hero'
import { BattleScene } from '../scenes/battle-scene'
import { BATTLE_STATES, TARGET_KEYS, TargetKeys } from './keys'
import { ATTACK_CONFIGS, DAMAGE_CONFIGS, DEATH_CONFIGS } from './visual-configs'

export class BattleManager {
  private scene: BattleScene
  private attacker: BoardCard | Hero
  private defender: BoardCard | Hero
  private dead: (BoardCard | Hero)[]
  private board: {
    PLAYER: Board
    OPPONENT: Board
  }

  constructor(
    scene: BattleScene,
    board: {
      PLAYER: Board
      OPPONENT: Board
    }
  ) {
    this.scene = scene
    this.board = board
    this.dead = []
  }

  public get getAttacker(): BoardCard | Hero {
    return this.attacker
  }

  public get getDefender(): BoardCard | Hero {
    return this.defender
  }

  public set setAttacker(attacker: BoardCard | Hero) {
    this.attacker = attacker
  }

  public set setDefender(defender: BoardCard | Hero) {
    this.defender = defender
  }

  public addCancelImage(x: number, y: number, scale: number): Phaser.GameObjects.Image {
    return this.scene.add.image(x, y, UI_ASSET_KEYS.CANCEL).setScale(scale).setAlpha(0)
  }

  public battle(): void {
    const attacker = this.attacker
    const defender = this.defender

    if (attacker && defender) {
      // Remove cancel if player selected this
      if (attacker.player === TARGET_KEYS.PLAYER) {
        attacker.removeCancel()
      }

      this.board[attacker.player].depth = 1
      this.attack(() => {
        this.board[attacker.player].depth = 0
        this.scene.stateMachine.setState(BATTLE_STATES.AFTER_BATTLE_CHECK)
      })
    }
  }

  public afterBattleCheck(turn: TargetKeys): void {
    // Set turn state
    const setState = () => {
      this.cleanup()

      if (turn === TARGET_KEYS.PLAYER) {
        this.scene.stateMachine.setState(BATTLE_STATES.PLAYER_TURN)
      } else {
        this.scene.stateMachine.setState(BATTLE_STATES.OPPONENT_TURN)
      }
    }

    const attacker = this.attacker
    const defender = this.defender

    if (attacker && defender) {
      const attackerHealth = attacker.healthAmount
      const defenderHealth = defender.healthAmount

      // Check if attacker died
      if (attackerHealth <= 0) {
        this.dead.push(attacker)
      }

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

  private attack(callback?: () => void): void {
    const startX = this.attacker.container.x
    const startY = this.attacker.container.y
    this.attacker.container.setDepth(1)

    // Get target position based on opponent type
    const target = this.getAttackTargetPosition()

    // Attack animation
    this.animateAttack({ x: startX, y: startY }, target, () => {
      // Damage
      this.applyDamage()
      this.animateDamageTaken()

      this.attacker.setAlreadyAttacked = true

      // Return to the original position
      this.animateReturnToPosition({ x: startX, y: startY }, () => {
        callback?.()
        this.attacker.container.setDepth(0)
      })
    })
  }

  /**
   * Get target position based on opponent type
   */
  private getAttackTargetPosition(): { x: number; y: number } {
    const opponentBounds = this.defender.container.getBounds()
    const cardBounds = this.attacker.container.getBounds()

    if (this.attacker instanceof BoardCard) {
      return {
        x: opponentBounds.centerX - cardBounds.centerX + this.attacker.container.x,
        y: opponentBounds.centerY - cardBounds.centerY + this.attacker.container.height / 3,
      }
    }

    return { x: opponentBounds.centerX, y: opponentBounds.centerY + this.attacker.container.height / 3 }
  }

  /**
   * Animates taking a step back and crashing into defending minion
   */
  private animateAttack(
    startPosition: { x: number; y: number },
    targetPosition: { x: number; y: number },
    callback?: () => void
  ): void {
    // Card takes a step back
    this.scene.tweens.add({
      targets: this.attacker.container,
      y: startPosition.y + ATTACK_CONFIGS.STEP_BACK.Y[this.attacker.player],
      duration: ATTACK_CONFIGS.STEP_BACK.DURATION,
      ease: ATTACK_CONFIGS.STEP_BACK.EASE,
      onComplete: () => {
        // Attack enemy
        this.scene.tweens.add({
          targets: this.attacker.container,
          x: targetPosition.x,
          y: targetPosition.y,
          duration: ATTACK_CONFIGS.ATTACK.DURATION,
          ease: ATTACK_CONFIGS.ATTACK.EASE,
          onComplete: () => callback?.(),
        })
      },
    })
  }

  /**
   * Apply damage to the opponent and update health values
   */
  private applyDamage(): void {
    this.defender.setHealthAmount = this.defender.healthAmount - this.attacker.attackAmount

    // Defending heroes don't deal damage
    if (this.defender instanceof BoardCard) {
      this.attacker.setHealthAmount = this.attacker.healthAmount - this.defender.attackAmount
    }
  }

  /**
   * Flash, Particles and Camera Shake when damage taken
   */
  private animateDamageTaken(): void {
    // Flash effect
    this.scene.tweens.add({
      targets: this.defender.container,
      alpha: DAMAGE_CONFIGS.FLASH.ALPHA,
      duration: DAMAGE_CONFIGS.FLASH.DURATION,
      yoyo: DAMAGE_CONFIGS.FLASH.YOYO,
      repeat: DAMAGE_CONFIGS.FLASH.REPEAT,
    })

    // Particle effect
    this.scene.add.particles(
      this.defender.container.getBounds().centerX,
      this.defender.container.getBounds().centerY,
      EFFECT_ASSET_KEYS.SPARK,
      {
        scale: DAMAGE_CONFIGS.SPARK.SCALE,
        speed: DAMAGE_CONFIGS.SPARK.SPEED,
        lifespan: DAMAGE_CONFIGS.SPARK.LIFESPAN,
        gravityY: DAMAGE_CONFIGS.SPARK.GRAVITY_Y,
        duration: DAMAGE_CONFIGS.SPARK.DURATION,
      }
    )

    // Camera shake
    this.scene.cameras.main.shake(DAMAGE_CONFIGS.CAMERA.DURATION, DAMAGE_CONFIGS.CAMERA.INTENSITY)
  }

  /**
   * Returns minion to original position
   */
  private animateReturnToPosition(position: { x: number; y: number }, callback?: () => void): void {
    this.scene.tweens.add({
      targets: this.attacker.container,
      x: position.x,
      y: position.y,
      duration: ATTACK_CONFIGS.RETURN.DURATION,
      ease: ATTACK_CONFIGS.RETURN.EASE,
      onComplete: () => {
        callback?.()
      },
    })
  }

  /**
   * Death Animation: Shrink and fade out
   */
  private death(callback?: () => void): void {
    this.dead.forEach((card) => {
      card.image.setTint(DEATH_CONFIGS.TINT)
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
