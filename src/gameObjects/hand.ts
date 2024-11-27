import { TargetKeys } from '../utils/event-keys'
import { onAddCardToHand } from '../utils/event-listeners'
import { Card } from './card'

export class Hand {
  private handCards: Card[]
  private owner: TargetKeys
  private emitter: Phaser.Events.EventEmitter

  constructor(owner: TargetKeys, emitter: Phaser.Events.EventEmitter) {
    this.owner = owner
    this.emitter = emitter

    this.handCards = []
    this.setEvents()
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

  private setEvents(): void {
    onAddCardToHand(this.emitter, ({ player, card }) => {
      if (this.owner === player) {
        this.drawCard(card)
      }
    })
  }
}
