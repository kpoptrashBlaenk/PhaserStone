export const TARGET_KEYS = Object.freeze({
  PLAYER: 'PLAYER',
  ENEMY: 'ENEMY',
})
export type TargetKeys = keyof typeof TARGET_KEYS

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
  PLAYER_BATTLECRY_CHOOSE_TARGET: 'PLAYER_BATTLECRY_CHOOSE_TARGET',
  PLAYER_BATTLECRY_TARGET_CHOSEN: 'PLAYER_BATTLECRY_TARGET_CHOSEN',

  PLAYER_BATTLE_CHOOSE_TARGET: 'PLAYER_BATTLE_CHOOSE_TARGET',
  PLAYER_BATTLE_TARGET_CHOSEN: 'PLAYER_BATTLE_TARGET_CHOSEN',
  ENEMY_BATTLE_CHOOSE_TARGET: 'ENEMY_BATTLE_CHOOSE_TARGET',
  ENEMY_BATTLE_TARGET_CHOSEN: 'ENEMY_BATTLE_TARGET_CHOSEN',

  CHECK_BOARD: 'CHECK_BOARD',

  GAME_END: 'GAME_END',
})
export type States = keyof typeof STATES

export const WARNING_KEYS = Object.freeze({
  CANT_PLAY: "YOU CAN'T PLAY THIS RIGHT NOW",
  NOT_VALID_TARGET: 'THIS IS NOT A VALID TARGET',
  CANT_BE_SELECTED: "THIS CAN'T BE SELECTED RIGHT NOW",
})
export type WarningKeys = (typeof WARNING_KEYS)[keyof typeof WARNING_KEYS]
