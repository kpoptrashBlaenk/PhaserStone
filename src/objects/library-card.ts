import { CardData } from '../utils/card-keys'
import { BaseCard } from './base-card'

export class LibraryCard extends BaseCard {
  constructor(scene: Phaser.Scene, cardData: CardData) {
    super(scene, cardData)
  }

  /**
   * Remove hover effect because useless for library scene
   */
  public removeHover() {
    this._cardTemplateImage.off('pointerover')
    this._cardTemplateImage.off('pointerout')
  }
}
