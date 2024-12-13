import { CARD_ASSETS_KEYS, CardAssetKeys } from '../../assets/asset-keys'
import { setOutline } from '../../common/outline'
import { BattleScene } from '../../scenes/battle-scene'
import { Coordinate } from '../../types/typedef'
import { BATTLE_STATES, TARGET_KEYS, TargetKeys, WARNING_KEYS } from '../../utils/keys'
import { CARD_SCALE, PLAYER_BOARD_BOUNDS } from '../../utils/visual-configs'
import { Card } from './card'
import { CardData } from './card-keys'

export class HandCard extends Card {
  private pointerCheckpoint: Coordinate
  private cardContainerCheckpoint: Coordinate
  private isPlayable: boolean

  constructor(scene: BattleScene, card: CardData, owner: TargetKeys) {
    super(scene, card, owner)
    this.isPlayable = false

    this.handSize()
    this.showBackSide()
  }

  public set cardImageAsset(assetKey: CardAssetKeys) {
    this.cardImage.setTexture(assetKey)
  }

  /**
   * Show front side and add Add Hover and Drag
   */
  public showFrontSide(): void {
    this.cardCostText.setAlpha(1)
    this.cardAttackText.setAlpha(1)
    this.cardHealthText.setAlpha(1)
    this.cardNameText.setAlpha(1)

    this.cardImage.setInteractive({
      cursor: 'pointer',
    })
    this.addHover()
    this.addDrag()
  }

  /**
   * Compare cost to mana crystals to see if it's playable and add or remove border
   */
  public checkPlayable(currentMana: number): void {
    const canBePlayed = currentMana >= this.card.cost
    setOutline(this.scene, canBePlayed, this.cardImage)
    this.isPlayable = canBePlayed
  }

  /**
   * Remove Border
   */
  public removeOutline(): void {
    setOutline(this.scene, false, this.cardImage)
    this.isPlayable = false
  }

  /**
   * Add PreviewUI to hover and hide it on unhover
   */
  private addHover(): void {
    this.cardImage.on('pointerover', () => {
      this.scene.playerPreview.modifyPreviewCardObjects(this.card, this.originalCard)
    })

    this.cardImage.on('pointerout', () => {
      this.scene.playerPreview.hideCard()
    })
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
      if (this.scene.stateMachine.currentStateName === BATTLE_STATES.PLAYER_TURN && this.isPlayable) {
        this.cardContainer.setData('draggingFromHand', true).setDepth(1)
        this.pointerCheckpoint = {
          x: pointer.x,
          y: pointer.y,
        }
        this.cardContainerCheckpoint = {
          x: this.cardContainer.x,
          y: this.cardContainer.y,
        }
      } else {
        this.scene.warnMessage.showTurnMessage(WARNING_KEYS.CANT_PLAY)
      }
    })

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!this.cardContainer.getData('draggingFromHand')) {
        return
      }
      this.cardContainer.x = this.cardContainerCheckpoint.x + (pointer.x - this.pointerCheckpoint.x)
      this.cardContainer.y = this.cardContainerCheckpoint.y + (pointer.y - this.pointerCheckpoint.y)
    })

    this.cardImage.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (this.cardContainer.getData('draggingFromHand')) {
        this.cardContainer.setData('draggingFromHand', false).setDepth(0)
        // Check if card is placed on board
        if (
          pointer.x >= PLAYER_BOARD_BOUNDS.startX &&
          pointer.x <= PLAYER_BOARD_BOUNDS.endX &&
          pointer.y >= PLAYER_BOARD_BOUNDS.startY &&
          pointer.y <= PLAYER_BOARD_BOUNDS.endY
        ) {
          // Play Card
          this.scene.stateMachine.setState(
            this.owner === TARGET_KEYS.PLAYER
              ? BATTLE_STATES.PLAYER_PLAY_CARD
              : BATTLE_STATES.OPPONENT_PLAY_CARD,
            this
          )
        } else {
          // Return to Hand
          this.cardContainer.setPosition(this.cardContainerCheckpoint.x, this.cardContainerCheckpoint.y)

          this.scene.playerPreview.hideCard()
        }
      }
    })
  }

  /**
   * Show only CardBack
   */
  private showBackSide(): void {
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
    this.cardContainer.setScale(CARD_SCALE)
    this.cardContainer.setSize(
      this.cardContainer.width * this.cardContainer.scaleX,
      this.cardContainer.height * this.cardContainer.scaleY
    )
  }
}
