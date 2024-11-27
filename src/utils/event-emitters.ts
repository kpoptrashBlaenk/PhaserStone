import { Card } from '../gameObjects/card'
import { EVENTS_KEYS, TargetKeys } from './event-keys'

export function emitDrawFromDeck(emitter: Phaser.Events.EventEmitter, player: TargetKeys): void {
  emitter.emit(EVENTS_KEYS.DRAW_FROM_DECK, { player: player })
  console.log('Card drawn')
}

export function emitAddCardToHand(emitter: Phaser.Events.EventEmitter, player: TargetKeys, card: Card): void {
  emitter.emit(EVENTS_KEYS.ADD_CARD_TO_HAND, { player: player, card: card })
  console.log('Card added')
}

export function emitCardPlayedOnBoard(
  emitter: Phaser.Events.EventEmitter,
  player: TargetKeys,
  card: Card
): void {
  emitter.emit(EVENTS_KEYS.CARD_PLAYED_ON_BOARD, { player: player, card: card })
}
