import { Card } from '../gameObjects/card'
import { EVENTS_KEYS, TargetKeys } from './event-keys'

/**
 * Emit Draw from deck
 */
export function emitDrawFromDeck(emitter: Phaser.Events.EventEmitter, player: TargetKeys): void {
  emitter.emit(EVENTS_KEYS.DRAW_FROM_DECK, { player: player })
}

/**
 * Emit Add card to hand
 */
export function emitAddCardToHand(emitter: Phaser.Events.EventEmitter, player: TargetKeys, card: Card): void {
  emitter.emit(EVENTS_KEYS.ADD_CARD_TO_HAND, { player: player, card: card })
}

/**
 * Emit Card played on board
 */
export function emitCardPlayedOnBoard(
  emitter: Phaser.Events.EventEmitter,
  player: TargetKeys,
  card: Card
): void {
  emitter.emit(EVENTS_KEYS.CARD_PLAYED_ON_BOARD, { player: player, card: card })
}
