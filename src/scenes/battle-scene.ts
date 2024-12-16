import { Background } from '../ui/background'
import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'

export class BattleScene extends BaseScene {
  constructor() {
    super({
      key: SCENE_KEYS.BATTLE_SCENE,
    })
  }

  update(): void {
    super.update()

    // this.stateMachine.update()
  }

  create(): void {
    super.create()

    new Background(this)
  }
}
