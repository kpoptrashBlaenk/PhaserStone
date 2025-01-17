import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'

export class LibraryScene extends BaseScene {
  constructor() {
    super({
      key: SCENE_KEYS.LIBRARY_SCENE,
    })
  }
}
