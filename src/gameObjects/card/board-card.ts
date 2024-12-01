import { TARGET_KEYS, TargetKeys } from '../../utils/keys'
import { CardData } from './card-keys'
import { Card } from './card'
import { BattleScene } from '../../scenes/battle-scene'

export class BoardCard extends Card {
  private owner: TargetKeys

  constructor(scene: BattleScene, card: CardData, owner: TargetKeys) {
    super(scene, card)
    this.owner = owner

    this.boardSize()

    if (this.owner === TARGET_KEYS.PLAYER) {
      this.forPlayer()
    }
  }

  /**
   * Add Hover and Drag
   */
  private forPlayer(): void {
    this.cardImage.setInteractive()
    this.addHover()
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
