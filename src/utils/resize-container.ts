import { RESIZE_CONFIGS } from './visual-configs'

export function resizeContainer(container: Phaser.GameObjects.Container, callback?: () => void): void {
  const padding = 10
  let newWidth = 0
  let newHeight = 0
  let index = 0

  container.iterate((child: Phaser.GameObjects.Container) => {
    container.scene.tweens.add({
      targets: child,
      x: child.width * index,
      duration: RESIZE_CONFIGS.DURATION,
      ease: RESIZE_CONFIGS.EASE,
    })

    newWidth += child.width
    newHeight = child.height + padding
    index++
  })

  container.width = newWidth
  container.height = newHeight

  callback?.()
}

export function repositionContainer(container: Phaser.GameObjects.Container, x: number, y: number): void {
  container.scene.tweens.add({
    targets: container,
    x: x,
    y: y,
    duration: RESIZE_CONFIGS.DURATION,
    ease: RESIZE_CONFIGS.EASE,
  })
}
