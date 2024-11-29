import { TARGET_KEYS, TargetKeys } from '../utils/keys'
import { Card } from './card'

export class Hand {
  private scene: Phaser.Scene
  private owner: TargetKeys
  private handContainer: Phaser.GameObjects.Container

  constructor(scene: Phaser.Scene, owner: TargetKeys) {
    this.scene = scene
    this.owner = owner

    this.handContainer = this.createHandContainer()
  }

  /**
   * Create HandCardUI -> Add it to handContainer -> Set data of handCardUI -> Resize handContainer
   */
  public drawCard(card: Card): void {
    this.handContainer.add(card.cardUI)
    card.showCard()
    this.resizeHandContainer()
  }

  /**
   * Resize handContainer
   */
  private resizeHandContainer(): void {
    // Also reposition it
    const padding = 10
    let newWidth = 0
    let newHeight = 0
    let index = 0

    this.handContainer.iterate((child: Phaser.GameObjects.Container) => {
      child.setX(child.width * index)
      newWidth += child.width
      newHeight = child.height + padding
      index++
    })

    this.handContainer.width = newWidth
    this.handContainer.height = newHeight
    this.setPosition()
  }

  /**
   * Set Position of handContainer
   */
  private setPosition(): void {
    if (this.owner === TARGET_KEYS.PLAYER) {
      this.handContainer.setPosition(
        this.scene.scale.width / 2 - this.handContainer.width / 2,
        this.scene.scale.height - this.handContainer.height
      )
    } else {
      this.handContainer.setPosition(this.scene.scale.width / 2 - this.handContainer.width / 2, 0)
    }
  }

  /**
   * Create handContainer
   */
  private createHandContainer(): Phaser.GameObjects.Container {
    return this.scene.add.container()
  }
}