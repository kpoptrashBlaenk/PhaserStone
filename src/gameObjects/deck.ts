import { TargetKeys } from '../utils/event-keys'
import { emitAddCardToHand } from '../utils/event-emitters'
import { onDrawFromDeck } from '../utils/event-listeners'
import { Card, CardData } from './card'

export class Deck {
  private deck: Card[]
  private owner: TargetKeys
  private emitter: Phaser.Events.EventEmitter

  constructor(allCards: CardData[], owner: TargetKeys, emitter: Phaser.Events.EventEmitter) {
    this.owner = owner
    this.emitter = emitter

    this.deck = this.createRandomDeck(allCards, 10)
    this.shuffle()

    this.setEvents()
  }

  public drawCard(): Card | undefined {
    return this.deck.shift()
  }

  private setEvents(): void {
    onDrawFromDeck(this.emitter, ({ player }) => {
      const cardDrawn = this.drawCard()
      if (cardDrawn) {
        if (this.owner === player) {
          emitAddCardToHand(this.emitter, player, cardDrawn)
        }
      } else {
        console.log('Fatigue')
      }
    })
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
