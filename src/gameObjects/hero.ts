import { UI_ASSET_KEYS } from '../assets/asset-keys'
import { TargetKeys } from '../utils/keys'
import { CARD_NUMBER_FONT_STYLE } from './card/card'

const HERO_CONFIGS = {
  width: 150,
  height: 150,
  color: 0x00ff00,
  y: {
    PLAYER: 770,
    OPPONENT: 210,
  },
}

export class Hero {
  private scene: Phaser.Scene
  private owner: TargetKeys
  private heroContainer: Phaser.GameObjects.Container
  private healthText: Phaser.GameObjects.Text
  private currentHealth: number

  constructor(scene: Phaser.Scene, owner: TargetKeys) {
    this.scene = scene
    this.owner = owner
    this.currentHealth = 30

    this.createHero()
  }

  /**
   * Create hero container
   */
  private createHero(): void {
    // Portrait
    const portrait = this.scene.add.rectangle(
      0,
      0,
      HERO_CONFIGS.width,
      HERO_CONFIGS.height,
      HERO_CONFIGS.color
    )

    // Health
    const healthImage = this.scene.add.image(0, 0, UI_ASSET_KEYS.HEALTH).setOrigin(0)
    const healthText = this.scene.add
      .text(healthImage.width / 2, healthImage.height / 2, String(this.currentHealth), CARD_NUMBER_FONT_STYLE)
      .setScale(2.5)
      .setOrigin(0.5)
    const healthContainer = this.scene.add.container(0, 0, [healthImage, healthText]).setScale(0.25)
    healthContainer.setPosition((healthImage.width / 3) * healthContainer.scale)

    // Container
    this.heroContainer = this.scene.add
      .container(this.scene.scale.width / 2, HERO_CONFIGS.y[this.owner], [portrait, healthContainer])
      .setSize(portrait.width, portrait.height)
      .setInteractive({
        cursor: 'pointer',
      })
  }
}
