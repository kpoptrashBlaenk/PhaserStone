import { Card, CardData } from './card'

export class Deck {
  private deck: Card[]

  constructor(allCards: CardData[]) {
    this.deck = this.createRandomDeck(allCards, 10)
    this.shuffle()
  }

  public drawCard(): Card | undefined {
    return this.deck.shift()
  }

  private createRandomDeck(allCards: CardData[], count: number): Card[] {
    const deck = []
    const availableCards = [...allCards]

    for (let i = 0; i < count; i++) {
      const randomNumber = Math.floor(Math.random() * availableCards.length)
      deck.push(new Card(availableCards.splice(randomNumber, 1)[0]))
    }

    return deck
  }

  private shuffle(): void {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]
    }
  }
}
