import Phaser from 'phaser'
import { SceneKeys } from './scene-keys'

export class BaseScene extends Phaser.Scene {
  constructor(config: { key: SceneKeys }) {
    super(config)
    if (this.constructor === BaseScene) {
      throw new Error('BaseScene is an abstract class and cannot be instantiated.')
    }
  }

  init(data?: any) {
    this.log(`[${this.constructor.name}:init] invoked`)
    this.log(`[${this.constructor.name}:init] data provided: ${JSON.stringify(data)}`)
  }

  preload() {
    this.log(`[${this.constructor.name}:preload] invoked`)
  }

  create() {
    this.log(`[${this.constructor.name}:create] invoked`)
  }

  update() {}

  public handleSceneResume(data?: any | undefined) {
    if (data) {
      this.log(`[${this.constructor.name}:handleSceneResume] invoked, data provided: ${JSON.stringify(data)}`)
      return
    }
    this.log(`[${this.constructor.name}:handleSceneResume] invoked`)
  }

  public handleSceneCleanup() {
    this.log(`[${this.constructor.name}:handleSceneCleanup] invoked`)
    this.events.off(Phaser.Scenes.Events.RESUME, this.handleSceneResume, this)
  }

  protected log(message: string) {
    console.log(`%c${message}`, 'color: orange; background: black;')
  }
}
