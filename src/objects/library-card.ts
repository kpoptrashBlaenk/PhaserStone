import { CardData } from '../utils/card-keys'
import { BaseCard } from './base-card'

export class LibraryCard extends BaseCard {
  constructor(scene: Phaser.Scene, cardData: CardData) {
    super(scene, cardData)
  }

  public removeHover() {
    this._cardTemplateImage.off('pointerover')
    this._cardTemplateImage.off('pointerout')
  }
}
