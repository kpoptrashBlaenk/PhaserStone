import { CARD_ASSETS_KEYS, CardAssetKeys } from '../../../../src/assets/asset-keys'
import { setOutline } from '../../common/outline'
import { BattleScene } from '../../scenes/battle-scene'
import { Coordinate } from '../../../../src/types/typedef'
import { BATTLE_STATES, TARGET_KEYS, TargetKeys, WARNING_KEYS } from '../../../../src/utils/keys'
import { CARD_SCALE, PLAYER_BOARD_BOUNDS } from '../../utils/visual-configs'
import { Card } from './card'
import { CardData } from './card-keys'

export class HandCard extends Card {
  private pointerCheckpoint: Coordinate
  private cardContainerCheckpoint: Coordinate
  private isPlayable: boolean
  private cancelImage: Phaser.GameObjects.Image | undefined

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
    this.cardTemplate.setAlpha(1)
    this.handleImage()

    this.cardTemplate.setInteractive({
      cursor: 'pointer',
    })
    this.addHover()
    this.addDrag()
  }

  /**
   * Compare cost to mana crystals and check board space to see if it's playable and add or remove border
   */
  public checkPlayable(): boolean {
    const canBePlayed = this.scene.board[this.owner].hasSpace
      ? this.scene.mana[this.owner].getCurrentMana >= this.card.cost
      : false
    this.isPlayable = canBePlayed

    if (this.owner === TARGET_KEYS.PLAYER) {
      setOutline(this.scene, canBePlayed, this.cardTemplate)
    }

    return canBePlayed
  }

  /**
   * Remove Border
   */
  public removeOutline(): void {
    setOutline(this.scene, false, this.cardTemplate)
    this.isPlayable = false
  }

  /**
   * Add PreviewUI to hover and hide it on unhover
   */
  private addHover(): void {
    this.cardTemplate.on('pointerover', () => {
      this.scene.playerPreview.modifyPreviewCardObjects(this.card, this.originalCard)
    })

    this.cardTemplate.on('pointerout', () => {
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
    const callback = () => {
      this.scene.stateMachine.setState(
        this.owner === TARGET_KEYS.PLAYER ? BATTLE_STATES.PLAYER_PLAY_CARD : BATTLE_STATES.OPPONENT_PLAY_CARD,
        this
      )
      this.removeCancel()
    }

    const fallback = () => {
      this.cardContainer.setPosition(this.cardContainerCheckpoint.x, this.cardContainerCheckpoint.y)
      this.scene.stateMachine.setState(
        this.owner === TARGET_KEYS.PLAYER ? BATTLE_STATES.PLAYER_TURN : BATTLE_STATES.OPPONENT_TURN
      )
      this.removeCancel()
    }

    // Click Down
    this.cardTemplate.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // Draggable
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
        return
      }

      // Cancellable
      if (this.scene.stateMachine.currentStateName === BATTLE_STATES.PLAYER_CHOOSE_TARGET) {
        fallback()
        return
      }

      this.scene.warnMessage.showTurnMessage(WARNING_KEYS.CANT_PLAY)
    })

    // Click Move
    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!this.cardContainer.getData('draggingFromHand')) {
        return
      }
      this.cardContainer.x = this.cardContainerCheckpoint.x + (pointer.x - this.pointerCheckpoint.x)
      this.cardContainer.y = this.cardContainerCheckpoint.y + (pointer.y - this.pointerCheckpoint.y)
    })

    // Click Up
    this.cardTemplate.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (this.cardContainer.getData('draggingFromHand')) {
        this.cardContainer.setData('draggingFromHand', false).setDepth(0)
        // Check if card is placed on board
        if (
          pointer.x >= PLAYER_BOARD_BOUNDS.startX &&
          pointer.x <= PLAYER_BOARD_BOUNDS.endX &&
          pointer.y >= PLAYER_BOARD_BOUNDS.startY &&
          pointer.y <= PLAYER_BOARD_BOUNDS.endY
        ) {
          // Cancel Button´´
          this.cancelImage = this.scene.battleManager
            .addCancelImage(
              this.cardContainer.width / 2 / this.cardContainer.scale,
              this.cardContainer.height / 2 / this.cardContainer.scale,
              0.8
            )
            .setAlpha(1)
          this.cardContainer.add(this.cancelImage)

          // Check Effects and play card (callback) or return (fallback)
          this.scene.battlecry.checkForEffect(this, callback, fallback)
        } else {
          // Return to Hand
          this.cardContainer.setPosition(this.cardContainerCheckpoint.x, this.cardContainerCheckpoint.y)

          this.scene.playerPreview.hideCard()
        }
      }
    })
  }

  /**
   * Remove cancel image when selection cancelled or fulfilled
   */
  private removeCancel(): void {
    this.cancelImage?.destroy()
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
    this.cardTemplate.setAlpha(0)
    this.cardImage.setScale(1)
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
