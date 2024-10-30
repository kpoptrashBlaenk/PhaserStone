import Phaser from 'phaser'
import { SCENE_KEYS } from './scenes/scene-keys'
import { BattleScene } from './scenes/battle-scene'
import { PreloadScene } from './scenes/preload-scene'

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

game.scene.add(SCENE_KEYS.PRELOAD_SCENE, PreloadScene)
game.scene.add(SCENE_KEYS.BATTLE_SCENE, BattleScene)

game.scene.start(SCENE_KEYS.PRELOAD_SCENE)
