import { TARGET_KEYS, TargetKeys } from '../utils/keys'
import { HandCard } from './card/hand-card'

export class Hand {
  private scene: Phaser.Scene
  private owner: TargetKeys
  private handContainer: Phaser.GameObjects.Container
  private hand: HandCard[]

  constructor(scene: Phaser.Scene, owner: TargetKeys) {
    this.scene = scene
    this.owner = owner

    this.hand = []
    this.handContainer = this.createHandContainer()
  }

  /**
   * Create HandCardUI -> Add it to handContainer -> Set data of handCardUI -> Resize handContainer
   */
  public drawCard(card: HandCard): void {
    this.hand.push(card)
    this.handContainer.add(card.cardUI)
    card.showCard()
    this.resizeHandContainer()
  }

  /**
   * Remove Card from hand and handContainer -> Resize
   */
  public playCard(card: HandCard): void {
    const index = this.hand.findIndex((handCard) => handCard === card)
    this.hand.splice(index, 1)
    this.handContainer.remove(card.cardUI)
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
