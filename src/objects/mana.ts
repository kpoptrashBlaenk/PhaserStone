import { UI_ASSET_KEYS } from '../assets/asset-keys'
import { MAX_MANA } from '../utils/configs'
import { TARGET_KEYS, TargetKeys } from '../utils/keys'
import { CARD_CONFIG, MANA_CONFIG } from '../utils/visual-configs'

export class Mana {
  private $scene: Phaser.Scene
  private $owner: TargetKeys
  private $manaText: Phaser.GameObjects.Text
  private $currentMana: number
  private $maxMana: number
  private $manaLimit: number
  private $manaContainer: Phaser.GameObjects.Container | undefined

  constructor(scene: Phaser.Scene, owner: TargetKeys) {
    this.$scene = scene
    this.$owner = owner
    this.$currentMana = 0
    this.$maxMana = 0
    this.$manaLimit = MAX_MANA

    this.$createMana()
  }

  /**
   * Add a mana crystal if max mana is not reached
   */
  public addMana(): void {
    if (this.$currentMana >= this.$manaLimit) {
      return
    }

    this.$maxMana += 1

    // If player, add crystal
    if (this.$manaContainer) {
      const manaCrystal = this.$scene.add.image(0, 0, UI_ASSET_KEYS.MANA_CRYSTAL).setScale(0.08).setOrigin(0)
      const x = this.$manaContainer.list.length * manaCrystal.width * manaCrystal.scale
      manaCrystal.setX(x)
      this.$manaContainer.add(manaCrystal)
    }
  }

  /**
   * Refreshes mana to max
   */
  public refreshMana(): void {
    this.$currentMana = this.$maxMana
    this.$manaText.setText(`${this.$currentMana}/${this.$maxMana}`)

    this.$manaContainer?.iterate((manaCrystal: Phaser.GameObjects.Image) => {
      manaCrystal.setTint(MANA_CONFIG.CRYSTAL.TINT.TINT_FULL)
    })
  }

  /**
   * Create mana, player will have mana crystals
   */
  private $createMana(): void {
    this.$manaText = this.$scene.add
      .text(
        MANA_CONFIG.TEXT_POSITION[this.$owner].X,
        MANA_CONFIG.TEXT_POSITION[this.$owner].Y,
        `${this.$currentMana}/${this.$maxMana}`,
        CARD_CONFIG.FONT_STYLE.NUMBER
      )
      .setOrigin(0)
      .setScale(0.5)

    if (this.$owner === TARGET_KEYS.PLAYER) {
      this.$manaContainer = this.$scene.add.container(
        MANA_CONFIG.CRYSTAL.POSITION.X,
        MANA_CONFIG.CRYSTAL.POSITION.Y
      )
    }
  }
}
