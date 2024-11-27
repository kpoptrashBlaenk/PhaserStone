import { TargetKeys } from '../event-keys'
import { Card } from './card'

export class Board {
  private boardCards: Card[]
  private owner: TargetKeys
  private emitter: Phaser.Events.EventEmitter

  constructor(owner: TargetKeys, emitter: Phaser.Events.EventEmitter) {
    this.owner = owner
    this.emitter = emitter

    this.boardCards = []
  }

  public get minionsOnBoard(): Card[] {
    return this.boardCards
  }

  public playMinion(card: Card): void {
    this.boardCards.push(card)
  }
}
