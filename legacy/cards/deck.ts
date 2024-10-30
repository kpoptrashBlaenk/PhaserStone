import { Card } from '../../src/types/typedef'

export class Deck {
  private cards: Card[]

  constructor(allCards: Card[]) {
    this.cards = this.createRandomDeck(allCards, 10)
    this.shuffle()
  }

  private createRandomDeck(allCards: Card[], count: number): Card[] {
    const deck = []
    const availableCards = [...allCards]

    for (let i = 0; i < count; i++) {
      const randomNumber = Math.floor(Math.random() * availableCards.length)
      deck.push(availableCards.splice(randomNumber, 1)[0])
    }

    return deck
  }

  private shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]
    }
  }

  public draw(): Card | undefined {
    return this.cards.shift()
  }

  public isEmpty(): boolean {
    return this.cards.length === 0
  }

  public get count(): number {
    return this.cards.length
  }
}
