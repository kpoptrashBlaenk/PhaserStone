import { EFFECT_ASSET_KEYS } from '../assets/asset-keys'
import { Card } from '../objects/card'
import { ANIMATION_CONFIG, BOARD_CONFIG } from './visual-configs'

export class AnimationManager {
  private $scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.$scene = scene
  }

  public flipCard(card: Card, callback?: () => void) {
    this.$scene.tweens.add({
      targets: card.container,
      scaleX: ANIMATION_CONFIG.DECK.FLIP.SCALE_X,
      duration: ANIMATION_CONFIG.DECK.FLIP.DURATION,
      ease: ANIMATION_CONFIG.DECK.FLIP.EASE,
      onComplete: () => {
        card.setSide('FRONT')
        this.$scene.tweens.add({
          targets: card.container,
          scaleX: ANIMATION_CONFIG.DECK.DECK_TO_HAND.SCALE_X,
          duration: ANIMATION_CONFIG.DECK.DECK_TO_HAND.DURATION,
          ease: ANIMATION_CONFIG.DECK.DECK_TO_HAND.EASE,
          onComplete: () => callback?.(),
        })
      },
    })
  }

  public addToContainer(
    card: Card,
    container: Phaser.GameObjects.Container,
    resizer: () => void,
    callback?: () => void
  ) {
    const originalPositionX = card.container.getBounds().x
    const originalPositionY = card.container.getBounds().y

    container.add(card.container)

    // Place card to the right of container then resize
    const newPositionX = container.width
    const newPositionY = 0

    card.container.setPosition(originalPositionX - container.x, originalPositionY - container.y)

    // Moving to Hand Animation
    this.$scene.tweens.add({
      targets: card.container,
      x: newPositionX,
      y: newPositionY,
      duration: ANIMATION_CONFIG.HAND.DECK_TO_HAND.DURATION,
      ease: ANIMATION_CONFIG.HAND.DECK_TO_HAND.EASE,
      onComplete: () => {
        resizer()
        callback?.()
      },
    })
  }

  public death(card: Card, callback?: () => void): void {
    card.portrait.setTint(ANIMATION_CONFIG.DEATH.TINT)
    card.template.setTint(ANIMATION_CONFIG.DEATH.TINT)

    const { x, y } = {
      x: card.container.x + card.container.width / 2,
      y: card.container.y + card.container.height / 2,
    }

    // Shrink
    this.$scene.tweens.add({
      x: x,
      y: y,
      delay: ANIMATION_CONFIG.DEATH.DELAY,
      targets: card.container,
      scale: ANIMATION_CONFIG.DEATH.SCALE,
      alpha: ANIMATION_CONFIG.DEATH.ALPHA,
      duration: ANIMATION_CONFIG.DEATH.DURATION,
      ease: ANIMATION_CONFIG.DEATH.EASE,
      onComplete: callback,
    })
  }

  /**
   * Animates opponent playing card from hand
   */
  public animateCardFromHandToBoard(card: Card, callback?: () => void): void {
    card.setSide('FRONT')
    this.$scene.tweens.add({
      targets: card.container,
      x: this.$scene.scale.width / 2 - card.container.getBounds().centerX + card.container.x,
      y:
        BOARD_CONFIG.POSITION_Y.ENEMY -
        card.container.getBounds().y +
        card.container.y -
        card.container.height,
      duration: ANIMATION_CONFIG.HAND.HAND_TO_BOARD.DURATION,
      ease: ANIMATION_CONFIG.HAND.HAND_TO_BOARD.EASE,
      onComplete: () => {
        callback?.()
      },
    })
  }

  public battlecryProjectile(source: Card, target: Card, impact?: () => void, callback?: () => void): void {
    const sourceBounds = source.container.getBounds()
    const targetBounds = target.container.getBounds()

    const effect = this.$scene.add
      .image(sourceBounds.centerX, sourceBounds.centerY, EFFECT_ASSET_KEYS.SPARK)
      .setScale(0.2)

    // Projectile Effect
    this.$scene.tweens.add({
      targets: effect,
      x: targetBounds.centerX,
      y: targetBounds.centerY,
      duration: 200,
      ease: 'Sine.easeOut',
      onComplete: () => {
        impact?.()
        effect.destroy()
        this.$flashEffect(target.container)
        this.$particleEffect(target.container)
        callback?.()
      },
    })
  }

  public attack(attacker: Card, defender: Card, damageHandler: () => void, callback?: () => void): void {
    const startPosition = { x: attacker.container.x, y: attacker.container.y }
    const targetPosition = {
      x:
        defender.container.getBounds().centerX -
        attacker.container.getBounds().centerX +
        attacker.container.x,
      y:
        defender.container.getBounds().centerY -
        attacker.container.getBounds().centerY +
        attacker.container.y,
    }

    this.$stepBack(attacker, startPosition, () =>
      this.$crash(attacker.container, targetPosition, () => {
        attacker.setAttacked(true)
        damageHandler()
        this.$flashEffect(defender.container)
        this.$particleEffect(defender.container)
        this.$shake()
        this.$attackReturn(attacker.container, startPosition, callback)
      })
    )
  }

  private $flashEffect(container: Phaser.GameObjects.Container): void {
    this.$scene.tweens.add({
      targets: container,
      alpha: ANIMATION_CONFIG.DAMAGE.FLASH.ALPHA,
      duration: ANIMATION_CONFIG.DAMAGE.FLASH.DURATION,
      yoyo: ANIMATION_CONFIG.DAMAGE.FLASH.YOYO,
      repeat: ANIMATION_CONFIG.DAMAGE.FLASH.REPEAT,
    })
  }

  private $particleEffect(container: Phaser.GameObjects.Container): void {
    this.$scene.add.particles(
      container.getBounds().centerX,
      container.getBounds().centerY,
      EFFECT_ASSET_KEYS.SPARK,
      {
        scale: ANIMATION_CONFIG.DAMAGE.SPARK.SCALE,
        speed: ANIMATION_CONFIG.DAMAGE.SPARK.SPEED,
        lifespan: ANIMATION_CONFIG.DAMAGE.SPARK.LIFESPAN,
        gravityY: ANIMATION_CONFIG.DAMAGE.SPARK.GRAVITY_Y,
        duration: ANIMATION_CONFIG.DAMAGE.SPARK.DURATION,
      }
    )
  }

  private $shake(): void {
    this.$scene.cameras.main.shake(
      ANIMATION_CONFIG.DAMAGE.CAMERA.DURATION,
      ANIMATION_CONFIG.DAMAGE.CAMERA.INTENSITY
    )
  }

  private $stepBack(attacker: Card, start: { x: number; y: number }, callback?: () => void): void {
    this.$scene.tweens.add({
      targets: attacker.container,
      y: start.y + ANIMATION_CONFIG.ATTACK.STEP_BACK.Y[attacker.player],
      duration: ANIMATION_CONFIG.ATTACK.STEP_BACK.DURATION,
      ease: ANIMATION_CONFIG.ATTACK.STEP_BACK.EASE,
      onComplete: callback,
    })
  }

  private $crash(
    container: Phaser.GameObjects.Container,
    target: { x: number; y: number },
    callback?: () => void
  ): void {
    this.$scene.tweens.add({
      targets: container,
      x: target.x,
      y: target.y,
      duration: ANIMATION_CONFIG.ATTACK.ATTACK.DURATION,
      ease: ANIMATION_CONFIG.ATTACK.ATTACK.EASE,
      onComplete: callback,
    })
  }

  private $attackReturn(
    container: Phaser.GameObjects.Container,
    position: { x: number; y: number },
    callback?: () => void
  ): void {
    this.$scene.tweens.add({
      targets: container,
      x: position.x,
      y: position.y,
      duration: ANIMATION_CONFIG.ATTACK.RETURN.DURATION,
      ease: ANIMATION_CONFIG.ATTACK.RETURN.EASE,
      onComplete: callback,
    })
  }
}
