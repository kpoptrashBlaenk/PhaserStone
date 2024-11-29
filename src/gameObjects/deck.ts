import { TargetKeys } from '../utils/keys'
import { Card } from './card'
import { CardData } from './card-keys'

export class Deck {
  private scene: Phaser.Scene
  private owner: TargetKeys
  private deck: Card[]

  constructor(scene: Phaser.Scene, allCards: CardData[], owner: TargetKeys) {
    this.scene = scene
    this.owner = owner

    this.deck = this.createRandomDeck(allCards)

    this.shuffle()
  }

  /**
   * Remove and return top card
   */
  public drawCard(): Card | undefined {
    return this.deck.shift()
  }

  /**
   * Create Random Deck
   */
  private createRandomDeck(allCards: CardData[]): Card[] {
    const deck = []
    const availableCards = [...allCards]

    for (let i = 0; i < allCards.length; i++) {
      const randomNumber = Math.floor(Math.random() * availableCards.length)
      const card = new Card(this.scene, availableCards.splice(randomNumber, 1)[0], this.owner)
      card.hideCard()
      deck.push(card)
    }

    return deck
  }

  /**
   * Shuffle Deck
   */
  private shuffle(): void {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]
    }
  }
}
