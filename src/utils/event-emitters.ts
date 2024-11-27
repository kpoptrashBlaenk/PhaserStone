import { Card } from '../gameObjects/card'
import { EVENTS_KEYS, TargetKeys } from './event-keys'

export function emitDrawFromDeck(emitter: Phaser.Events.EventEmitter, player: TargetKeys): void {
  emitter.emit(EVENTS_KEYS.DRAW_FROM_DECK, { player: player })
}

export function emitAddCardToHand(emitter: Phaser.Events.EventEmitter, player: TargetKeys, card: Card): void {
  emitter.emit(EVENTS_KEYS.ADD_CARD_TO_HAND, { player: player, card: card })
}
