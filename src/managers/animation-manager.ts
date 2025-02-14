import { EFFECT_ASSET_KEYS } from '../assets/asset-keys'
import { FONT_KEYS } from '../assets/font-keys'
import { Card } from '../objects/card'
import { Hero } from '../objects/hero'
import { SCENE_KEYS } from '../scenes/scene-keys'
import { ANIMATION_CONFIG, BOARD_CONFIG, BUTTON_CONFIG, CARD_CONFIG } from '../utils/visual-configs'

/**
 * The AnimationManager handles all animations
 */
export class AnimationManager {
  private $scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.$scene = scene
  }

  /**
   * Set scaleX to 0 then set side to 'FRONT' then scaleX to default, then callback
   *
   * @param card {@link Card} to be flipped
   * @param callback Usually hands drawCard()
   */
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

  /**
   * Move card to container then resize
   *
   * @param card {@link Card} to add to container
   * @param container Container to add card to
   * @param resizer The container resize function
   */
  public addToContainer(card: Card, container: Phaser.GameObjects.Container, resizer: () => void) {
    const originalPositionX = card.container.getBounds().x
    const originalPositionY = card.container.getBounds().y

    container.add(card.container)

    // Place card to the right of container then resize
    const newPositionX = container.width
    const newPositionY = 0

    card.container.setPosition(originalPositionX - container.x, originalPositionY - container.y)

    // Moving to container animation
    this.$scene.tweens.add({
      targets: card.container,
      x: newPositionX,
      y: newPositionY,
      duration: ANIMATION_CONFIG.HAND.DECK_TO_HAND.DURATION,
      ease: ANIMATION_CONFIG.HAND.DECK_TO_HAND.EASE,
      onComplete: () => {
        resizer()
      },
    })
  }

  /**
   * Set tint of card then shrink it
   *
   * @param card {@link Card} or {@link Hero} that dies
   * @param callback Usually boards cardDies()
   */
  public death(card: Card | Hero, callback?: () => void): void {
    card.portrait.setTint(ANIMATION_CONFIG.DEATH.TINT)

    if (card instanceof Card) {
      card.template.setTint(ANIMATION_CONFIG.DEATH.TINT)
    }

    const { x, y } =
      card instanceof Card
        ? {
            x: card.container.x + card.container.width / 2,
            y: card.container.y + card.container.height / 2,
          }
        : {
            x: card.container.x,
            y: card.container.y,
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
   * Set side to 'FRONT' to gain hovers then move it board
   *
   * @param card {@link Card} to move to board
   * @param callback Usually removeFromHand() within hands playCard()
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

  /**
   * Create and move projectile effect then impact, {@link $flashEffect()}, {@link $particleEffect()} and callback
   *
   * @param source {@link Card} with the battlecry
   * @param target {@link Card} or {@link Hero} that is targeted
   * @param impact What happens on impact, usually set health
   * @param callback Usually play card to execute after animations
   */
  public battlecryDamage(
    source: Card,
    target: Card | Hero,
    impact?: () => void,
    callback?: () => void
  ): void {
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

  /**
   * Create and move projectile effect then impact and callback
   *
   * @param source {@link Card} with the battlecry
   * @param target {@link Card} or {@link Hero} that is targeted
   * @param impact What happens on impact, usually set health
   * @param callback Usually play card to execute after animations
   */
  public battlecryHeal(source: Card, target: Card | Hero, impact?: () => void, callback?: () => void) {
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
        callback?.()
      },
    })
  }

  /**
   * {@link $stepBack()}, then {@link $crash()},
   * then damageHandler(), {@link $flashEffect()}, {@link $particleEffect()}, {@link $shake()} and {@link $attackReturn()}
   *
   * @param attacker {@link Card} or {@link Hero} that attacks
   * @param defender {@link Card} or {@link Hero} that is being attacked
   * @param damageHandler The damage handler defined in battle managers $battle()
   * @param callback Usually check board state
   */
  public attack(
    attacker: Card | Hero,
    defender: Card | Hero,
    damageHandler: () => void,
    callback?: () => void
  ): void {
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

  /**
   * Create end game message and animate it, then give end game button to return to library
   *
   * @param message Game end message
   * @param callback Set game end state
   */
  public gameEnd(message: string, callback?: () => void): void {
    const sceneWidth = this.$scene.scale.width
    const sceneHeight = this.$scene.scale.height

    // Gray overlay
    this.$scene.add
      .rectangle(sceneWidth / 2, sceneHeight / 2, sceneWidth, sceneHeight, 0x000000, 0.5)
      .setDepth(24)
      .setInteractive() // blocks interactions under

    // End Game Text
    const endGameText = this.$scene.add
      .text(sceneWidth / 2, sceneHeight / 2, message, {
        fontFamily: FONT_KEYS.HEARTHSTONE,
        fontSize: '64px',
        color: message === 'You won!' ? '#FFD700' : '#FF4C4C',
        stroke: '#000000',
        strokeThickness: 6,
        align: 'center',
        shadow: {
          offsetX: 3,
          offsetY: 3,
          color: '#000000',
          blur: 6,
          fill: true,
        },
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(25)

    // End Game Text Animation
    this.$scene.tweens.add({
      targets: endGameText,
      alpha: { from: 0, to: 1 },
      scale: { from: 0.5, to: 1.2 },
      ease: 'Back.Out',
      duration: 1000,
      onComplete: () => {
        // End Game Button
        const endButton = this.$scene.add
          .rectangle(0, 0, BUTTON_CONFIG.WIDTH * 1.5, BUTTON_CONFIG.HEIGHT * 1.5, 0x0000ff)
          .setOrigin(0.5)
          .setScale(0.5)

        // End Game Button Text
        const endButtonText = this.$scene.add
          .text(0, 0, 'End Game', CARD_CONFIG.FONT_STYLE.NUMBER)
          .setOrigin(0.5)
          .setScale(0.5)

        // End Game Button Container
        const endButtonContainer = this.$scene.add
          .container(endGameText.x, endGameText.y + endButton.height, [endButton, endButtonText])
          .setAlpha(0)
          .setDepth(25)
          .setSize(endButton.width * endButton.scale, endButton.height * endButton.scale)

        endButtonContainer.setInteractive({ cursor: 'pointer' })
        endButtonContainer.addListener('pointerup', () => {
          console.log('End Game')
          this.$scene.scene.start(SCENE_KEYS.LIBRARY_SCENE)
        })

        // End Game Button Animation
        this.$scene.tweens.add({
          targets: endButtonContainer,
          alpha: { from: 0, to: 1 },
          scale: { from: 0.5, to: 1.2 },
          ease: 'Back.Out',
          duration: 1000,
          onComplete: callback,
        })
      },
    })
  }

  /**
   * Flash effect for damage taken
   *
   * @param container Container to fash
   */
  private $flashEffect(container: Phaser.GameObjects.Container): void {
    this.$scene.tweens.add({
      targets: container,
      alpha: ANIMATION_CONFIG.DAMAGE.FLASH.ALPHA,
      duration: ANIMATION_CONFIG.DAMAGE.FLASH.DURATION,
      yoyo: ANIMATION_CONFIG.DAMAGE.FLASH.YOYO,
      repeat: ANIMATION_CONFIG.DAMAGE.FLASH.REPEAT,
    })
  }

  /**
   * Spark particles for damage taken
   *
   * @param container Container to add particles to
   */
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

  /**
   * Shake effect for crashes in battle
   */
  private $shake(): void {
    this.$scene.cameras.main.shake(
      ANIMATION_CONFIG.DAMAGE.CAMERA.DURATION,
      ANIMATION_CONFIG.DAMAGE.CAMERA.INTENSITY
    )
  }

  /**
   * Take step back to then crash into target
   *
   * @param attacker {@link Card} or {@link Hero} that attacks
   * @param start Starting coordinates
   * @param callback Usually {@link $crash()}
   */
  private $stepBack(attacker: Card | Hero, start: { x: number; y: number }, callback?: () => void): void {
    this.$scene.tweens.add({
      targets: attacker.container,
      y: start.y + ANIMATION_CONFIG.ATTACK.STEP_BACK.Y[attacker.player],
      duration: ANIMATION_CONFIG.ATTACK.STEP_BACK.DURATION,
      ease: ANIMATION_CONFIG.ATTACK.STEP_BACK.EASE,
      onComplete: callback,
    })
  }

  /**
   * Crash into the target
   * 
   * @param container {@link Card} or {@link Hero} that attacks
   * @param target {@link Card} or {@link Hero} that is being attacked
   * @param callback Damage taken animations and return
   */
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

  /**
   * Return to original position after attack
   * 
   * @param container {@link Card} or {@link Hero} that attacked
   * @param position Original position
   * @param callback Usually check board state
   */
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
