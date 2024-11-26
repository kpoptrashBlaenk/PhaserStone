import { Card } from './card'

export class Board {
  private boardCards: Card[]

  constructor() {
    this.boardCards = []
  }

  public get minionsOnBoard(): Card[] {
    return this.boardCards
  }

  public playMinion(card: Card): void {
    this.boardCards.push(card)
  }
}