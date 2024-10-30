import { Card } from '../../src/types/typedef'

const MAX_HAND_SIZE = 10
const HAND_PADDING = 10

export class Hand {
  private scene: Phaser.Scene
  private handContainer: Phaser.GameObjects.Container
  private cards: Card[] = []

  constructor(scene: Phaser.Scene, handContainer: Phaser.GameObjects.Container) {
    this.scene = scene
    this.handContainer = handContainer
  }

  public addCard(card: Card): void {
    if (this.cards.length >= MAX_HAND_SIZE) {
      console.log('hand full')
      return
    }

    this.cards.push(card)
    this.renderCard(card)
  }

  public removeCard(card: Card): void {
    const cardIndex = this.cards.indexOf(card)
    if (cardIndex > -1) {
      this.cards.splice(cardIndex, 1)
      this.handContainer.remove(this.handContainer.getAt(cardIndex))
      this.repositionCards()
    }
  }

  private renderCard(card: Card): void {
    const cardImage = this.scene.add.image(0, 10, card.assetKey).setScale(0.15).setOrigin(0)
    this.applyHoverEffect(cardImage)
    this.handContainer.add(cardImage)
    this.repositionCards()
  }

  private repositionCards(): void {
    const images = this.handContainer.getAll().filter((child) => child instanceof Phaser.GameObjects.Image)

    images.forEach((cardImage, index) => {
      const xPosition = index * cardImage.width * cardImage.scaleX - HAND_PADDING * index
      ;(cardImage as Phaser.GameObjects.Image).setX(xPosition)
    })
  }

  private applyHoverEffect(cardImage: Phaser.GameObjects.Image): void {
    cardImage.setInteractive()
    cardImage.on('pointerover', () => {
      cardImage.setScale(0.2)
    })
    cardImage.on('pointerout', () => {
      cardImage.setScale(0.18)
    })
  }

  public clear(): void {
    this.cards = []
    this.handContainer.removeAll(true)
  }

  public getCardCount(): number {
    return this.cards.length
  }
}
