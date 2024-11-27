import { EVENTS_KEYS, TargetKeys, TARGETS_KEYS } from '../../event-keys'
import { Card } from '../../gameObjects/card'
import { HandCardUI } from '../card/hand-card-ui'
import { PreviewUI } from '../preview/preview-ui'

export class HandUI {
  protected scene: Phaser.Scene
  protected handContainer: Phaser.GameObjects.Container
  protected onPlayCallback: (card: Card) => void
  private owner: TargetKeys
  private emitter: Phaser.Events.EventEmitter
  private previewUI: PreviewUI

  constructor(
    scene: Phaser.Scene,
    previewUI: PreviewUI,
    onPlayCallback: (card: Card) => void,
    owner: TargetKeys,
    emitter: Phaser.Events.EventEmitter
  ) {
    this.scene = scene
    this.previewUI = previewUI
    this.onPlayCallback = onPlayCallback
    this.owner = owner
    this.emitter = emitter

    this.createHandContainer()
    this.setEvents()
  }

  public getCardContainer(card: Card): Phaser.GameObjects.Container | null {
    for (const cardContainer of this.handContainer.getAll()) {
      const handCardUI = cardContainer.getData('handCardUI') as HandCardUI
      if (handCardUI && handCardUI.thisCard === card) {
        return cardContainer as Phaser.GameObjects.Container // Promise this is a Container
      }
    }

    return null // If no card
  }

  public playCard(card: Phaser.GameObjects.Container): void {
    this.handContainer.remove(card, true)
    this.resizeHandContainer()
  }

  public drawCard(card: Card): void {
    const cardContainer = new HandCardUI(
      this.scene,
      card,
      this.previewUI,
      this.onPlayCallback,
      this.owner,
      this.emitter
    )
    this.handContainer.add(cardContainer.cardContainer)
    cardContainer.cardContainer.setData('handCardUI', cardContainer)
    this.resizeHandContainer()
  }

  protected resizeHandContainer(): void {
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

  protected setPosition(): void {
    if (this.owner === TARGETS_KEYS.PLAYER) {
      this.handContainer.setPosition(
        this.scene.scale.width / 2 - this.handContainer.width / 2,
        this.scene.scale.height - this.handContainer.height
      )
    } else {
      this.handContainer.setPosition(this.scene.scale.width / 2 - this.handContainer.width / 2, 0)
    }
  }

  private setEvents(): void {
    this.emitter.on(EVENTS_KEYS.ADD_CARD_TO_HAND, ({ player, card }: { player: TargetKeys; card: Card }) => {
      if (this.owner === player) {
        this.drawCard(card)
      }
    })
  }

  private createHandContainer(): void {
    this.handContainer = this.scene.add.container()
  }
}
