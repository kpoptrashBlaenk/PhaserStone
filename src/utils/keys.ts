export const TARGET_KEYS = Object.freeze({
  PLAYER: 'PLAYER',
  OPPONENT: 'OPPONENT',
})
export type TargetKeys = keyof typeof TARGET_KEYS

export const BATTLE_STATES = Object.freeze({
  PLAYER_TURN: 'PLAYER_TURN',
  PLAYER_MINION_CHOSEN: 'PLAYER_MINION_CHOSEN',
  OPPONENT_MINION_CHOSEN: 'OPPONENT_MINION_CHOSEN',
  MINION_BATTLE: 'MINION_BATTLE',
})
export type BattleStates = keyof typeof BATTLE_STATES
