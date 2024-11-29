import { TARGET_KEYS, TargetKeys } from '../../utils/keys'
import { CardData } from './card-keys'
import { Card } from './card'
import { BattleScene } from '../../scenes/battle-scene'

const CARD_NAME_PADDING_X = 10
const PREVIEW_CARD_PADDING = 20

export class Preview extends Card {
  private owner: TargetKeys

  constructor(scene: BattleScene, card: CardData, owner: TargetKeys) {
    super(scene, card)
    this.owner = owner

    this.setPosition()
    this.hideCard()
  }

  /**
   * Modify Card Objects
   */
  public modifyPreviewCardObjects(card: CardData): void {
    this.cardImage.setTexture(card.assetKey)
    this.cardCostText.setText(String(card.cost))
    this.cardAttackText.setText(String(card.attack))
    this.cardHealthText.setText(String(card.health))
    this.cardNameText.setText(card.name)
    this.cardNameText.setX(
      this.cardImage.x + this.cardImage.width / 2 - this.cardNameText.width / 2 + CARD_NAME_PADDING_X
    )
    this.showCard()
  }

  /**
   * Set position, normal preview -> right, opponent play preview -> left
   */
  private setPosition(): void {
    if (this.owner === TARGET_KEYS.PLAYER) {
      this.cardContainer.setPosition(
        this.scene.scale.width - this.cardContainer.width * this.cardContainer.scaleX - PREVIEW_CARD_PADDING,
        PREVIEW_CARD_PADDING * 2
      )
    } else {
      this.cardContainer.setPosition(PREVIEW_CARD_PADDING, PREVIEW_CARD_PADDING * 2)
    }
  }
}
