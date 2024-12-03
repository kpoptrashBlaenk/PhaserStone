import { BattleScene } from '../scenes/battle-scene'
import { TARGET_KEYS, TargetKeys } from '../utils/keys'
import { BOARD_POSITION_Y } from './board'
import { HandCard } from './card/hand-card'

export class Hand {
  private scene: BattleScene
  private owner: TargetKeys
  private handContainer: Phaser.GameObjects.Container
  private hand: HandCard[]

  constructor(scene: BattleScene, owner: TargetKeys) {
    this.scene = scene
    this.owner = owner

    this.hand = []
    // Always above board cards
    this.handContainer = this.createHandContainer().setDepth(1)
  }

  /**
   * Return all hand cards
   */
  public get handCards(): HandCard[] {
    return this.hand
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
  public playCard(card: HandCard, callback: () => void): void {
    // Prepare remove card from hand function
    const removeFromHand = () => {
      const index = this.hand.findIndex((handCard) => handCard === card)
      this.hand.splice(index, 1)
      this.handContainer.remove(card.cardUI, true)
      this.resizeHandContainer()
      callback?.()
    }

    // If player, execute function, if not, play PlayCardAnimation and then execute function
    if (this.owner === TARGET_KEYS.PLAYER) {
      removeFromHand()
    } else {
      this.scene.tweens.add({
        targets: card.cardUI,
        x: this.scene.scale.width / 2 - card.cardUI.getBounds().centerX + card.cardUI.x,
        y: BOARD_POSITION_Y.OPPONENT - card.cardUI.getBounds().y + card.cardUI.y,
        duration: 500,
        ease: 'Sine.easeOut',
        onComplete: () => {
          removeFromHand()
        },
      })
    }
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
