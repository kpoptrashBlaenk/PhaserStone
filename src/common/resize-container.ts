import { RESIZE_CONFIG } from '../utils/visual-configs'

/**
 * Resize the container
 */
export function resizeContainer(container: Phaser.GameObjects.Container, callback?: () => void): void {
  const padding = 10
  let newWidth = 0
  let newHeight = 0
  let index = 0

  container.iterate((child: Phaser.GameObjects.Container) => {
    container.scene.tweens.add({
      targets: child,
      x: child.width * index,
      duration: RESIZE_CONFIG.DURATION,
      ease: RESIZE_CONFIG.EASE,
    })

    newWidth += child.width
    newHeight = child.height + padding
    index++
  })

  container.width = newWidth
  container.height = newHeight

  callback?.()
}

/**
 * Reposition the container
 */
export function repositionContainer(
  container: Phaser.GameObjects.Container,
  x: number,
  y: number,
  callback?: () => void
): void {
  container.scene.tweens.add({
    targets: container,
    x: x,
    y: y,
    duration: RESIZE_CONFIG.DURATION,
    ease: RESIZE_CONFIG.EASE,
    onComplete: callback,
  })
}
