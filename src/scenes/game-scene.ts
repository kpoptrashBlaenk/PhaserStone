import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'

export class GameScene extends BaseScene {
  constructor() {
    super({
      key: SCENE_KEYS.GAME_SCENE,
    })
  }
}
