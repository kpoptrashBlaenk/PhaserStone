import { Card } from '../gameObjects/card'
import { EVENTS_KEYS, TargetKeys } from './event-keys'

export function onDrawFromDeck(
  emitter: Phaser.Events.EventEmitter,
  callback: ({ player }: { player: TargetKeys }) => void
): void {
  emitter.on(EVENTS_KEYS.DRAW_FROM_DECK, ({ player }: { player: TargetKeys }) => {
    callback({ player })
  })
}

export function onAddCardToHand(
  emitter: Phaser.Events.EventEmitter,
  callback: ({ player, card }: { player: TargetKeys; card: Card }) => void
): void {
  emitter.on(EVENTS_KEYS.ADD_CARD_TO_HAND, ({ player, card }: { player: TargetKeys; card: Card }) => {
    callback({ player, card })
  })
}
