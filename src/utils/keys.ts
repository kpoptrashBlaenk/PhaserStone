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

export const STATES = Object.freeze({})
export type States = keyof typeof STATES

export const WARNING_KEYS = Object.freeze({
  CANT_PLAY: "YOU CAN'T PLAY THIS RIGHT NOW",
  SUMMONING_SICK: 'THIS MINION NEEDS A TURN TO BE READY',
  ALREADY_ATTACKED: 'THIS MINION ALREADY ATTACKED',
  NOT_VALID_TARGET: 'THIS IS NOT A VALID TARGET',
})
export type WarningKeys = (typeof WARNING_KEYS)[keyof typeof WARNING_KEYS]
