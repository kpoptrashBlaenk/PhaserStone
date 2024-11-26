import { Card } from './card'

export class Hand {
  private handCards: Card[]

  constructor() {
    this.handCards = []
  }

  public drawCard(card: Card): void {
    this.handCards.push(card)
  }

  public playCard(index: number): Card {
    return this.handCards.splice(index, 1)[0] // [0] because splice returns array of length 1
  }
}
