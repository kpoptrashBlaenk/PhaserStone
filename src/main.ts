import Phaser from 'phaser'
import BBCodeTextPlugin from 'phaser3-rex-plugins/plugins/bbcodetext-plugin.js'
import OutlinePipelinePlugin from 'phaser3-rex-plugins/plugins/outlinepipeline-plugin.js'
import { BattleScene } from './scenes/battle-scene'
import { LibraryScene } from './scenes/library-scene'
import { PreloadScene } from './scenes/preload-scene'
import { SCENE_KEYS } from './scenes/scene-keys'
import { loadFonts } from './utils/webfontloader'

function launchGame(): void {
  // Launch game instance
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    scale: {
      parent: 'game-container',
      width: 2048,
      height: 1024,
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    backgroundColor: '#000000',
    plugins: {
      global: [
        {
          key: 'rexOutlinePipeline',
          plugin: OutlinePipelinePlugin,
          start: true,
        },
        {
          key: 'rexBBCodeTextPlugin',
          plugin: BBCodeTextPlugin,
          start: true,
        },
      ],
    },
  })

  game.scene.add(SCENE_KEYS.PRELOAD_SCENE, PreloadScene)
  game.scene.add(SCENE_KEYS.BATTLE_SCENE, BattleScene)
  game.scene.add(SCENE_KEYS.LIBRARY_SCENE, LibraryScene)

  game.scene.start(SCENE_KEYS.PRELOAD_SCENE)
}

loadFonts(launchGame)
