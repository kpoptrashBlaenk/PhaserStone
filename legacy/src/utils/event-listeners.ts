import { Card } from '../gameObjects/card'
import { EVENTS_KEYS, TargetKeys } from './event-keys'

/**
 * Receive Draw from deck
 */
export function onDrawFromDeck(
  emitter: Phaser.Events.EventEmitter,
  callback: ({ player }: { player: TargetKeys }) => void
): void {
  emitter.on(EVENTS_KEYS.DRAW_FROM_DECK, ({ player }: { player: TargetKeys }) => {
    callback({ player })
  })
}

/**
 * Receive Add card to hand
 */
export function onAddCardToHand(
  emitter: Phaser.Events.EventEmitter,
  callback: ({ player, card }: { player: TargetKeys; card: Card }) => void
): void {
  emitter.on(EVENTS_KEYS.ADD_CARD_TO_HAND, ({ player, card }: { player: TargetKeys; card: Card }) => {
    callback({ player, card })
  })
}

/**
 * Receive Card played on board
 */
export function onCardPlayedOnBoard(
  emitter: Phaser.Events.EventEmitter,
  callback: ({ player, card }: { player: TargetKeys; card: Card }) => void
): void {
  emitter.on(EVENTS_KEYS.CARD_PLAYED_ON_BOARD, ({ player, card }: { player: TargetKeys; card: Card }) => {
    callback({ player, card })
  })
}
