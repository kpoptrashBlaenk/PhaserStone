import { Card } from '../objects/card'
import { ANIMATION_CONFIG } from './visual-configs'

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
}
