import { Card } from './card'

export class Hand {
  private handCards: Card[]

  constructor() {
    this.handCards = []
  }

  public get hand(): Card[] {
    return this.handCards
  }

  public drawCard(card: Card): void {
    this.handCards.push(card)
  }

  public playCard(card: Card): void {
    this.handCards.splice(this.handCards.indexOf(card), 1)
  }
}
