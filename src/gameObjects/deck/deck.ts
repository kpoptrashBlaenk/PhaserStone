import { Card } from '../card/card'
import { CardData, CONTEXT_KEYS } from '../card/card-keys'

export class Deck {
  private scene: Phaser.Scene
  private deck: Card[]

  constructor(scene: Phaser.Scene, allCards: CardData[]) {
    this.scene = scene

    this.deck = this.createRandomDeck(allCards)

    this.shuffle()
  }

  /**
   * Create Random Deck
   */
  private createRandomDeck(allCards: CardData[]): Card[] {
    const deck = []
    const availableCards = [...allCards]

    for (let i = 0; i < allCards.length; i++) {
      const randomNumber = Math.floor(Math.random() * availableCards.length)
      deck.push(new Card(this.scene, availableCards.splice(randomNumber, 1)[0], CONTEXT_KEYS.DECK))
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
