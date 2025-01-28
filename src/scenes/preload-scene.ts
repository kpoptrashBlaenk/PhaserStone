import { CARD_ASSETS_KEYS, DATA_ASSET_KEYS, EFFECT_ASSET_KEYS, UI_ASSET_KEYS } from '../assets/asset-keys'
import { LOADING_SCREEN } from '../utils/visual-configs'
import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'

export class PreloadScene extends BaseScene {
  constructor() {
    super({
      key: SCENE_KEYS.PRELOAD_SCENE,
    })
  }

  preload() {
    super.preload()

    const cardAssetsPath = 'assets/images/cards'
    const boardAssetsPath = 'assets/images/ui'
    const effectAssetsPath = 'assets/images/effects'

    // UI Assets
    this.load.image(UI_ASSET_KEYS.BOARD, `${boardAssetsPath}/board.webp`)
    this.load.image(UI_ASSET_KEYS.MANA_CRYSTAL, `${boardAssetsPath}/mana-crystal.webp`)
    this.load.image(UI_ASSET_KEYS.HEALTH, `${boardAssetsPath}/health.png`)
    this.load.image(UI_ASSET_KEYS.ATTACK, `${boardAssetsPath}/health.png`)
    this.load.image(UI_ASSET_KEYS.CANCEL, `${boardAssetsPath}/cancel.png`)

    // Card Assets
    this.load.image(CARD_ASSETS_KEYS.TEMPLATE, `${cardAssetsPath}/card-template.png`)
    this.load.image(CARD_ASSETS_KEYS.CARD_BACK, `${cardAssetsPath}/card-back.webp`)

    this.load.image(CARD_ASSETS_KEYS.ALEXSTRAZA, `${cardAssetsPath}/alexstraza.webp`)

    // Effect Assets
    this.load.image(EFFECT_ASSET_KEYS.SPARK, `${effectAssetsPath}/spark.png`)
    this.load.image(EFFECT_ASSET_KEYS.Z, `${effectAssetsPath}/z.png`)

    // JSON Data
    const apiUrl = (process.env.DB_EXTERNAL_HOST || `http://localhost:${process.env.PORT}`) + '/api/cards'
    this.load.json(DATA_ASSET_KEYS.CARDS, apiUrl)

    // Loading Screen
    this.$createLoading()
  }

  private $createLoading(): void {
    // Text
    const loadingText = this.add
      .text(this.scale.width / 2, this.scale.height / 2, 'Loading...', LOADING_SCREEN.TITLE)
      .setOrigin(0.5)

    const percentageText = this.add
      .text(
        this.scale.width / 2,
        loadingText.y + loadingText.height + LOADING_SCREEN.BAR.HEIGHT * 2,
        '0%',
        LOADING_SCREEN.SUBTITLE
      )
      .setOrigin(0.5)

    // Bar
    const progressBar = this.add.graphics()
    const progressBox = this.add.graphics()
    progressBox
      .fillStyle(LOADING_SCREEN.BAR.BACKGROUND_FILL, 0.8)
      .fillRect(
        this.scale.width / 2 - LOADING_SCREEN.BAR.WIDTH / 2,
        loadingText.y + loadingText.height,
        LOADING_SCREEN.BAR.WIDTH,
        LOADING_SCREEN.BAR.HEIGHT
      )

    // Loading
    this.load.on('progress', (value: number) => {
      percentageText.setText(Math.floor(value * 100) + '%')
      progressBar
        .fillStyle(LOADING_SCREEN.BAR.FILL, 1)
        .fillRect(
          this.scale.width / 2 - LOADING_SCREEN.BAR.WIDTH / 2,
          loadingText.y + loadingText.height,
          LOADING_SCREEN.BAR.WIDTH * value,
          LOADING_SCREEN.BAR.HEIGHT
        )
    })

    // Complete
    this.load.on('complete', () => {
      progressBar.destroy()
      progressBox.destroy()
      percentageText.destroy()
      loadingText.setText('Click to Start').setAlpha(LOADING_SCREEN.ANIMATION.ORIGIN_ALPHA)
      this.input.once('pointerdown', () => {
        this.scene.start(SCENE_KEYS.LIBRARY_SCENE)
      })
    })

    this.tweens.add({
      targets: loadingText,
      alpha: LOADING_SCREEN.ANIMATION.ALPHA,
      repeat: LOADING_SCREEN.ANIMATION.REPEAT,
      yoyo: LOADING_SCREEN.ANIMATION.YOYO,
      duration: LOADING_SCREEN.ANIMATION.DURATION,
    })
  }
}
