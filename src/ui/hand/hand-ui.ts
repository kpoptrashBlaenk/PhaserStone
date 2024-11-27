import { TargetKeys, TARGETS_KEYS } from '../../utils/event-keys'
import { Card } from '../../gameObjects/card'
import { HandCardUI } from '../card/hand-card-ui'
import { PreviewUI } from '../preview/preview-ui'
import { onAddCardToHand, onCardPlayedOnBoard } from '../../utils/event-listeners'

export class HandUI {
  private scene: Phaser.Scene
  private handContainer: Phaser.GameObjects.Container
  private onPlayCallback: (card: Card) => void
  private owner: TargetKeys
  private emitter: Phaser.Events.EventEmitter
  private previewUI: PreviewUI

  constructor(
    scene: Phaser.Scene,
    previewUI: PreviewUI,
    owner: TargetKeys,
    emitter: Phaser.Events.EventEmitter
  ) {
    this.scene = scene
    this.previewUI = previewUI
    this.owner = owner
    this.emitter = emitter

    this.createHandContainer()
    this.setEvents()
  }

  /**
   * Listeners: AddCardToHand, CardPlayedOnBoard
   */
  private setEvents(): void {
    onAddCardToHand(this.emitter, ({ player, card }) => {
      if (this.owner === player) {
        this.drawCard(card)
      }
    })

    onCardPlayedOnBoard(this.emitter, ({ player, card }) => {
      if (this.owner === player) {
        const playedCard = this.getCardContainer(card)
        if (playedCard) {
          this.playCard(playedCard)
        }
      }
    })
  }

  /**
   * Get Card data from HandCardUI
   */
  private getCardContainer(card: Card): Phaser.GameObjects.Container | null {
    for (const cardContainer of this.handContainer.getAll()) {
      const handCardUI = cardContainer.getData('handCardUI') as HandCardUI
      if (handCardUI && handCardUI.thisCard === card) {
        return cardContainer as Phaser.GameObjects.Container // Promise this is a Container
      }
    }

    return null // If no card
  }

  /**
   * Remove card from handContainer then resize it
   */
  private playCard(card: Phaser.GameObjects.Container): void {
    this.handContainer.remove(card, true)
    this.resizeHandContainer()
  }

  /**
   * Create HandCardUI -> Add it to handContainer -> Set data of handCardUI -> Resize handContainer
   */
  private drawCard(card: Card): void {
    const cardContainer = new HandCardUI(this.scene, card, this.previewUI, this.owner, this.emitter)
    this.handContainer.add(cardContainer.cardContainer)
    cardContainer.cardContainer.setData('handCardUI', cardContainer)
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
    if (this.owner === TARGETS_KEYS.PLAYER) {
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
  private createHandContainer(): void {
    this.handContainer = this.scene.add.container()
  }
}
