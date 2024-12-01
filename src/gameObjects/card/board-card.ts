import { BATTLE_STATES, TARGET_KEYS, TargetKeys } from '../../utils/keys'
import { CardData } from './card-keys'
import { Card } from './card'
import { BattleScene } from '../../scenes/battle-scene'

export class BoardCard extends Card {
  private owner: TargetKeys

  constructor(scene: BattleScene, card: CardData, owner: TargetKeys) {
    super(scene, card)
    this.owner = owner

    this.boardSize()
    this.cardImage.setInteractive()
    this.addHover()

    if (this.owner === TARGET_KEYS.PLAYER) {
      this.forPlayer()
    } else {
      this.forOpponent()
    }
  }

  /**
   * Add Click
   */
  private forPlayer(): void {
    this.cardImage.on('pointerup', () => {
      if (this.scene.stateMachine.currentStateName === BATTLE_STATES.PLAYER_TURN) {
        this.scene.stateMachine.setState(BATTLE_STATES.PLAYER_MINION_CHOSEN, this)
      }
    })
  }

  /**
   * Add Click
   */
  private forOpponent(): void {
    this.cardImage.on('pointerup', () => {
      if (this.scene.stateMachine.currentStateName === BATTLE_STATES.PLAYER_MINION_CHOSEN) {
        this.scene.stateMachine.setState(BATTLE_STATES.OPPONENT_MINION_CHOSEN, this)
      }
    })
  }

  /**
   * Add PreviewUI to hover and hide it on unhover
   */
  private addHover(): void {
    this.cardImage.on('pointerover', () => {
      this.scene.playerPreview.modifyPreviewCardObjects(this.card)
    })

    this.cardImage.on('pointerout', () => {
      this.scene.playerPreview.hideCard()
    })
  }

  /**
   * Resize Card to fit in hand
   */
  private boardSize(): void {
    this.cardContainer.setScale(0.36)
    this.cardContainer.setSize(
      this.cardContainer.width * this.cardContainer.scaleX,
      this.cardContainer.height * this.cardContainer.scaleY
    )
  }
}
