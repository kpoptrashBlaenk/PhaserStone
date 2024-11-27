import { TargetKeys } from '../utils/event-keys'
import { onCardPlayedOnBoard } from '../utils/event-listeners'
import { Card } from './card'

export class Board {
  private boardCards: Card[]
  private owner: TargetKeys
  private emitter: Phaser.Events.EventEmitter

  constructor(owner: TargetKeys, emitter: Phaser.Events.EventEmitter) {
    this.owner = owner
    this.emitter = emitter

    this.boardCards = []

    this.setEvents()
  }

  public get minionsOnBoard(): Card[] {
    return this.boardCards
  }

  public playMinion(card: Card): void {
    this.boardCards.push(card)
  }

  private setEvents(): void {
    onCardPlayedOnBoard(this.emitter, ({ player, card }) => {
      if (player === this.owner) {
        this.playMinion(card)
      }
    })
  }
}
