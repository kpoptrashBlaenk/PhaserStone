import { CARD_ASSETS_KEYS } from '../assets/asset-keys'
import { FONT_KEYS } from '../assets/font-keys'
import { Coordinate } from '../types/typedef'
import { TARGET_KEYS, TargetKeys } from '../utils/keys'
import { CardData } from './card-keys'

const CARD_NUMBER_FONT_STYLE = Object.freeze({
  fontFamily: FONT_KEYS.HEARTHSTONE,
  fontSize: '48px',
  fontStyle: 'bold',
  stroke: '#00000',
  strokeThickness: 4,
})

const CARD_NAME_FONT_STYLE = Object.freeze({
  ...CARD_NUMBER_FONT_STYLE,
  fontSize: '26px',
})

const CARD_COST_PADDING = {
  x: 25,
  y: 30,
}
const CARD_ATTACK_PADDING = {
  x: 25,
  y: -58,
}
const CARD_HEALTH_PADDING = {
  x: -50,
  y: -58,
}

const CARD_NAME_PADDING = {
  x: 0,
  y: 200,
}

export const PLAYER_BOARD_BOUNDS = Object.freeze({
  startX: 449,
  endX: 1599,
  startY: 487,
  endY: 637,
})

export class Card {
  private scene: Phaser.Scene
  private card: CardData
  private owner: TargetKeys
  private cardContainer: Phaser.GameObjects.Container
  private cardImage: Phaser.GameObjects.Image
  private cardCostText: Phaser.GameObjects.Text
  private cardAttackText: Phaser.GameObjects.Text
  private cardHealthText: Phaser.GameObjects.Text
  private cardNameText: Phaser.GameObjects.Text
  private pointerCheckpoint: Coordinate
  private cardContainerCheckpoint: Coordinate

  constructor(scene: Phaser.Scene, card: CardData, owner: TargetKeys) {
    this.scene = scene
    this.card = card
    this.owner = owner

    this.cardContainer = this.createCardObject(card)
    this.handSize()

    if (this.owner === TARGET_KEYS.PLAYER) {
      this.forPlayer()
    } else {
      this.forOpponent()
    }
  }

  public get cardUI() {
    return this.cardContainer
  }

  /**
   * Hides Card
   */
  public hideCard() {
    this.cardContainer.setAlpha(0)
  }

  /**
   * Shows Card
   */
  public showCard() {
    this.cardContainer.setAlpha(1)
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

  /**
   * Create card object with: Image, Text, Cost, Attack, Health, Name
   */
  private createCardObject(card: CardData): Phaser.GameObjects.Container {
    this.cardImage = this.scene.add.image(0, 0, card.assetKey).setOrigin(0)
    const cardContainer = this.scene.add
      .container(0, 0, this.cardImage)
      .setSize(this.cardImage.width, this.cardImage.height)

    this.cardCostText = this.scene.add.text(
      this.cardImage.x + CARD_COST_PADDING.x,
      this.cardImage.y + CARD_COST_PADDING.y,
      String(card.cost),
      CARD_NUMBER_FONT_STYLE
    )
    this.cardAttackText = this.scene.add.text(
      this.cardImage.x + CARD_ATTACK_PADDING.x,
      this.cardImage.y + this.cardImage.height + CARD_ATTACK_PADDING.y,
      String(card.attack),
      CARD_NUMBER_FONT_STYLE
    )
    this.cardHealthText = this.scene.add.text(
      this.cardImage.x + this.cardImage.width + CARD_HEALTH_PADDING.x,
      this.cardImage.y + this.cardImage.height + CARD_HEALTH_PADDING.y,
      String(card.health),
      CARD_NUMBER_FONT_STYLE
    )
    this.cardNameText = this.scene.add.text(
      0,
      this.cardImage.y + CARD_NAME_PADDING.y,
      card.name,
      CARD_NAME_FONT_STYLE
    )
    this.cardNameText.setX(this.cardImage.x + this.cardImage.width / 2 - this.cardNameText.width / 2)

    cardContainer.add([this.cardCostText, this.cardAttackText, this.cardHealthText, this.cardNameText])
    return cardContainer
  }
}
