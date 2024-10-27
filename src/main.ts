import Phaser from 'phaser'
import { SCENE_KEYS } from './scenes/scene-keys'
import { GameScene } from './scenes/game-scene'

// Launch game instance
const game = new Phaser.Game({
  type: Phaser.CANVAS,
  scale: {
    parent: 'game-container',
    width: 1024,
    height: 576,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: '#000000',
})

game.scene.add(SCENE_KEYS.GAME_SCENE, GameScene)