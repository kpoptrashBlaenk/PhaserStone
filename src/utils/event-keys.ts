export const EVENTS_KEYS = Object.freeze({
  DRAW_FROM_DECK: 'DRAW_FROM_DECK',
  ADD_CARD_TO_HAND: 'ADD_CARD_TO_HAND',
  CARD_PLAYED_ON_BOARD: 'CARD_PLAYED_ON_BOARD'
})

export const TARGETS_KEYS = Object.freeze({
  PLAYER: 'PLAYER',
  OPPONENT: 'OPPONENT',
})
export type TargetKeys = keyof typeof TARGETS_KEYS
