import { checkStats } from '../../common/set-stats'
import { BattleScene } from '../../scenes/battle-scene'
import { TARGET_KEYS, TargetKeys } from '../../utils/keys'
import { PREVIEW_CARD_PADDING } from '../../utils/visual-configs'
import { Card } from './card'
import { CardData } from './card-keys'

export class Preview extends Card {
  constructor(scene: BattleScene, card: CardData, owner: TargetKeys) {
    super(scene, card, owner)
    this.owner = owner

    this.setPosition()
    this.hideCard()
  }

  /**
   * Modify Card Objects
   */
  public modifyPreviewCardObjects(card: CardData, originalCard: CardData): void {
    this.originalCard = originalCard
    this.card = card

    this.cardImage.setTexture(card.assetKey)
    this.cardCostText.setText(String(card.cost))
    this.cardAttackText.setText(String(card.attack))
    this.cardHealthText.setText(String(card.health))
    this.setCardText(card.name)

    this.setStats()
    this.showCard()
  }

  /**
   * Sets stats then check for changes and apply colors
   */
  private setStats(): void {
    checkStats(this.card.attack, this.originalCard.attack, this.cardAttackText)
    checkStats(this.card.health, this.originalCard.health, this.cardHealthText)
    checkStats(this.card.cost, this.originalCard.cost, this.cardCostText)
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
