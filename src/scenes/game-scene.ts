import Phaser from 'phaser'
import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'
import { Board } from '../battle/board'

export class GameScene extends BaseScene {
  private board: Board

  constructor() {
    super({
      key: SCENE_KEYS.GAME_SCENE,
    })
  }

  create() {
    this.board = new Board(this)
  }
}
