export const SCENE_KEYS = Object.freeze({
  BASE_SCENE: 'BASE_SCENE',
  PRELOAD_SCENE: 'PRELOAD_SCENE',
  BATTLE_SCENE: 'BATTLE_SCENE'
})

export type SceneKeys = keyof typeof SCENE_KEYS
