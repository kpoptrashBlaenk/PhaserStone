import { Card } from '../../gameObjects/card'
import { PlayerPreviewUI } from '../preview/player-preview-ui'
import { CardUI } from './card-ui'

export class BoardCardUI extends CardUI {
  private previewUI: PlayerPreviewUI

  constructor(scene: Phaser.Scene, card: Card, previewUI: PlayerPreviewUI) {
    super(scene, card)

    this.forBoard(previewUI)
  }

  public get thisCard(): Card {
    return this.card
  }

  private forBoard(previewUI: PlayerPreviewUI): void {
    this.previewUI = previewUI

    this.cardContainer.setScale(0.36)
    this.cardContainer.setSize(
      this.cardContainer.width * this.cardContainer.scaleX,
      this.cardContainer.height * this.cardContainer.scaleY
    )

    this.cardImage.setInteractive()

    this.addHover()
  }

  private addHover(): void {
    this.cardImage.on('pointerover', () => {
      this.previewUI.changeCardContainer(this.card)
    })

    this.cardImage.on('pointerout', () => {
      this.previewUI.hideCardContainer()
    })
  }
}
