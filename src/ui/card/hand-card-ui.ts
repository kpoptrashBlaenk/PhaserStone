import { Card } from '../../gameObjects/card'
import { Coordinate } from '../../types/typedef'
import { PLAYER_BOARD_BOUNDS } from '../board-ui-controller'
import { CardUI } from './card-ui'
import { PreviewUI } from '../preview/preview-ui'
import { CARD_ASSETS_KEYS } from '../../assets/asset-keys'
import { TargetKeys, TARGETS_KEYS } from '../../event-keys'

export class HandCardUI extends CardUI {
  private previewUI: PreviewUI
  private pointerCheckpoint: Coordinate
  private cardContainerCheckpoint: Coordinate
  private onPlayCallback: (card: Card) => void
  private owner: TargetKeys
  private emitter: Phaser.Events.EventEmitter

  constructor(
    scene: Phaser.Scene,
    card: Card,
    previewUI: PreviewUI,
    onPlayCallback: (card: Card) => void,
    owner: TargetKeys,
    emitter: Phaser.Events.EventEmitter
  ) {
    super(scene, card)

    this.owner = owner
    this.emitter = emitter
    this.previewUI = previewUI
    this.onPlayCallback = onPlayCallback

    this.handSize()

    if (this.owner === TARGETS_KEYS.PLAYER) {
      this.forPlayer()
    } else {
      this.forOpponent()
    }
  }

  private handSize(): void {
    this.cardContainer.setScale(0.36)
    this.cardContainer.setSize(
      this.cardContainer.width * this.cardContainer.scaleX,
      this.cardContainer.height * this.cardContainer.scaleY
    )

    this.forPlayer()
  }

  private forPlayer(): void {
    this.cardImage.setInteractive()

    this.addHover()
    this.addDrag()
  }

  private forOpponent(): void {
    this.cardImage.setTexture(CARD_ASSETS_KEYS.CARD_BACK)
    this.cardCostText.setAlpha(0)
    this.cardAttackText.setAlpha(0)
    this.cardHealthText.setAlpha(0)
    this.cardNameText.setAlpha(0)
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
        // Play Card
        this.onPlayCallback(this.card)
      } else {
        // Return to Hand
        this.cardContainer.setPosition(this.cardContainerCheckpoint.x, this.cardContainerCheckpoint.y)
      }

      this.previewUI.hideCardContainer()
    })
  }
}
