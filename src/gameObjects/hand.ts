import { EVENTS_KEYS, TargetKeys } from '../event-keys'
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
    this.emitter.on(EVENTS_KEYS.ADD_CARD_TO_HAND, ({ player, card }: { player: TargetKeys; card: Card }) => {
      if (this.owner === player) {
        this.drawCard(card)
      }
    })
  }
}
