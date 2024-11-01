import { Card } from '../../gameObjects/card'
import { Coordinate } from '../../types/typedef'
import { PLAYER_BOARD_BOUNDS } from '../board-ui'
import { CardUI } from './card-ui'
import { PreviewUI } from '../preview-ui'

export class HandCardUI extends CardUI {
  private previewUI: PreviewUI
  private pointerCheckpoint: Coordinate
  private cardContainerCheckpoint: Coordinate

  constructor(scene: Phaser.Scene, card: Card, previewUI: PreviewUI) {
    super(scene, card)

    this.forHand(previewUI)
  }

  private forHand(previewUI: PreviewUI): void {
    this.previewUI = previewUI

    this.cardContainer.setScale(0.36)
    this.cardContainer.setSize(
      this.cardContainer.width * this.cardContainer.scaleX,
      this.cardContainer.height * this.cardContainer.scaleY
    )

    this.cardImage.setInteractive()

    this.addHover()
    this.addDrag()
  }

  private addHover(): void {
    this.cardImage.on('pointerover', () => {
      this.previewUI.changeCardContainer(this.card)
    })

    this.cardImage.on('pointerout', () => {
      this.previewUI.hideCardContainer()
    })
  }

  private addDrag(): void {
    this.cardImage.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.cardContainer.setData('draggingFromHand', true).setDepth(1)
      this.pointerCheckpoint = {
        x: pointer.x,
        y: pointer.y,
      }
      this.cardContainerCheckpoint = {
        x: this.cardContainer.x,
        y: this.cardContainer.y,
      }
    })

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.cardContainer.getData('draggingFromHand')) {
        this.cardContainer.x = this.cardContainerCheckpoint.x + (pointer.x - this.pointerCheckpoint.x)
        this.cardContainer.y = this.cardContainerCheckpoint.y + (pointer.y - this.pointerCheckpoint.y)
      }
    })

    this.cardImage.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      this.cardContainer.setData('draggingFromHand', false).setDepth(0)
      // Check if card is placed on board
      if (
        pointer.x >= PLAYER_BOARD_BOUNDS.startX &&
        pointer.x <= PLAYER_BOARD_BOUNDS.endX &&
        pointer.y >= PLAYER_BOARD_BOUNDS.startY &&
        pointer.y <= PLAYER_BOARD_BOUNDS.endY
      ) {
        // Play card
      } else {
        this.cardContainer.setPosition(this.cardContainerCheckpoint.x, this.cardContainerCheckpoint.y)
      }
    })
  }
}
