export function resizeContainer(container: Phaser.GameObjects.Container, callback?: () => void): void {
  const padding = 10
  let newWidth = 0
  let newHeight = 0
  let index = 0

  container.iterate((child: Phaser.GameObjects.Container) => {
    child.setX(child.width * index)
    newWidth += child.width
    newHeight = child.height + padding
    index++
  })

  container.width = newWidth
  container.height = newHeight

  callback?.()
}
