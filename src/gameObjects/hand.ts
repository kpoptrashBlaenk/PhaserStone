import { Card } from './card'

export class Hand {
  private handCards: Card[]

  constructor() {
    this.handCards = []
  }

  public drawCard(card: Card): void {
    this.handCards.push(card)
  }
}