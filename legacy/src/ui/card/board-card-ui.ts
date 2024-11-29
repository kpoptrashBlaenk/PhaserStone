import { Card } from '../../gameObjects/card'
import { PreviewUI } from '../preview/preview-ui'
import { CardUI } from './card-ui'

export class BoardCardUI extends CardUI {
  private previewUI: PreviewUI

  constructor(scene: Phaser.Scene, card: Card, previewUI: PreviewUI) {
    super(scene, card)

    this.forBoard(previewUI)
  }

  /**
   * Set size for Board Card
   * 
   * Add Hover
   */
  private forBoard(previewUI: PreviewUI): void {
    this.previewUI = previewUI

    this.cardContainer.setScale(0.36)
    this.cardContainer.setSize(
      this.cardContainer.width * this.cardContainer.scaleX,
      this.cardContainer.height * this.cardContainer.scaleY
    )

    this.cardImage.setInteractive()

    this.addHover()
  }

  /**
   * PreviewUI on hover and hide on unhover
   */
  private addHover(): void {
    this.cardImage.on('pointerover', () => {
      this.previewUI.changeCardContainer(this.card)
    })

    this.cardImage.on('pointerout', () => {
      this.previewUI.hideCardContainer()
    })
  }
}
