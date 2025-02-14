import OutlinePostFxPipeline from 'phaser3-rex-plugins/plugins/outlinepipeline'
import OutlinePipelinePlugin from 'phaser3-rex-plugins/plugins/outlinepipeline-plugin'
import { OUTLINE_CONFIG } from '../utils/visual-configs'

/**
 * Add or remove outline
 * 
 * @param scene Current scene
 * @param can If add outline or not
 * @param image The object to place the outline around
 */
export function setOutline(scene: Phaser.Scene, can: boolean, image: Phaser.GameObjects.Image): void {
  const border = scene.plugins.get('rexOutlinePipeline') as OutlinePipelinePlugin
  const borderOfImage = border.get(image) as OutlinePostFxPipeline[]
  const borderExists = borderOfImage.length !== 0

  if (can) {
    if (!borderExists) {
      border.add(image, {
        name: OUTLINE_CONFIG.NAME,
        quality: OUTLINE_CONFIG.QUALITY,
        thickness: OUTLINE_CONFIG.THICKNESS,
        outlineColor: OUTLINE_CONFIG.OUTLINE_COLOR,
      })
    }
    return
  }

  if (borderExists) {
    border.remove(image, OUTLINE_CONFIG.NAME)
  }
}
