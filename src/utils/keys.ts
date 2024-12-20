export const TARGET_KEYS = Object.freeze({
  PLAYER: 'PLAYER',
  ENEMY: 'ENEMY',
})
export type TargetKeys = keyof typeof TARGET_KEYS

export const BATTLE_TARGET_KEYS = Object.freeze({
  ATTACKER: 'ATTACKER',
  DEFENDER: 'DEFENDER',
})
export type BattleTargetKeys = keyof typeof BATTLE_TARGET_KEYS

export const STATES = Object.freeze({
  TURN_BUTTON: 'TURN_BUTTON',
  PLAYER_TURN_START: 'PLAYER_TURN_START',
  ENEMY_TURN_START: 'ENEMY_TURN_START',
  PLAYER_TURN: 'PLAYER_TURN',
  ENEMY_TURN: 'ENEMY_TURN',
  PLAYER_DRAW_CARD: 'PLAYER_DRAW_CARD',
  ENEMY_DRAW_CARD: 'ENEMY_DRAW_CARD',
  PLAYER_PLAY_CARD: 'PLAYER_PLAY_CARD',
  ENEMY_PLAY_CARD: 'ENEMY_PLAY_CARD',
  PLAYER_TURN_END: 'PLAYER_TURN_END',
  ENEMY_TURN_END: 'ENEMY_TURN_END',

  PLAYER_BATTLECRY: 'PLAYER_BATTLECRY',
  PLAYER_CHOOSE_TARGET: 'PLAYER_CHOOSE_TARGET',
  PLAYER_TARGET_CHOSEN: 'PLAYER_TARGET_CHOSEN',

  CHECK_BOARD: 'CHECK_BOARD',
})
export type States = keyof typeof STATES

export const WARNING_KEYS = Object.freeze({
  CANT_PLAY: "YOU CAN'T PLAY THIS RIGHT NOW",
  SUMMONING_SICK: 'THIS MINION NEEDS A TURN TO BE READY',
  ALREADY_ATTACKED: 'THIS MINION ALREADY ATTACKED',
  NOT_VALID_TARGET: 'THIS IS NOT A VALID TARGET',
})
export type WarningKeys = (typeof WARNING_KEYS)[keyof typeof WARNING_KEYS]
