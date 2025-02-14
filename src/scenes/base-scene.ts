import Phaser from 'phaser'
import { SceneKeys } from './scene-keys'

/**
 * BaseScene extends {@link Phaser.Scene}.
 * 
 * Extend this scene to log when scenes are invoked and to handle Scene Resume and Cleanup
 */
export class BaseScene extends Phaser.Scene {
  /**
   * 
   * @param {SceneKeys} config Select a key from {@link SceneKeys}
   */
  constructor(config: { key: SceneKeys }) {
    super(config)
    if (this.constructor === BaseScene) {
      throw new Error('BaseScene is an abstract class and cannot be instantiated.')
    }
  }

  /**
   * 
   * @param data Pass any data to this scene
   */
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

  /**
   * 
   * @param message Message in form of `[${this.constructor.name}:MethodName] invoked`
   */
  protected log(message: string) {
    console.log(`%c${message}`, 'color: orange; background: black;')
  }
}
