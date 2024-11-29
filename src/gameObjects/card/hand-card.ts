import { TARGET_KEYS, TargetKeys } from '../../utils/keys'
import { CardData } from './card-keys'
import { Card } from './card'
import { Coordinate } from '../../types/typedef'
import { CARD_ASSETS_KEYS } from '../../assets/asset-keys'

export const PLAYER_BOARD_BOUNDS = Object.freeze({
  startX: 449,
  endX: 1599,
  startY: 487,
  endY: 637,
})

export class HandCard extends Card {
  private owner: TargetKeys
  private pointerCheckpoint: Coordinate
  private cardContainerCheckpoint: Coordinate

  constructor(scene: Phaser.Scene, card: CardData, owner: TargetKeys) {
    super(scene, card)
    this.owner = owner

    this.handSize()

    if (this.owner === TARGET_KEYS.PLAYER) {
      this.forPlayer()
    } else {
      this.forOpponent()
    }
  }

  /**
   * Add Hover and Drag
   */
  private forPlayer(): void {
    this.cardImage.setInteractive()
    // this.addHover()
    this.addDrag()
  }

  /**
   * Pointerdown: Set draggingFromHand data to true
   *
   * Pointermove: Make card follow mouse
   *
   * Pointerup: If card on board, play it, if not return to hand
   */
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
      } else {
        // Return to Hand
        this.cardContainer.setPosition(this.cardContainerCheckpoint.x, this.cardContainerCheckpoint.y)
      }
    })
  }

  /**
   * Show only CardBack
   */
  private forOpponent(): void {
    this.cardImage.setTexture(CARD_ASSETS_KEYS.CARD_BACK)
    this.cardCostText.setAlpha(0)
    this.cardAttackText.setAlpha(0)
    this.cardHealthText.setAlpha(0)
    this.cardNameText.setAlpha(0)
  }

  /**
   * Resize Card to fit in hand
   */
  private handSize(): void {
    this.cardContainer.setScale(0.36)
    this.cardContainer.setSize(
      this.cardContainer.width * this.cardContainer.scaleX,
      this.cardContainer.height * this.cardContainer.scaleY
    )
  }
}
