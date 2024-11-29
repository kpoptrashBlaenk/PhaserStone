import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'


export class BattleScene extends BaseScene {

  constructor() {
    super({
      key: SCENE_KEYS.BATTLE_SCENE,
    })
  }
}
