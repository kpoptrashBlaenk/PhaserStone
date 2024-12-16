import { UI_ASSET_KEYS } from '../../../src/assets/asset-keys'
import { MAX_MANA } from '../../../src/utils/configs'
import { TARGET_KEYS, TargetKeys } from '../../../src/utils/keys'
import {
  CARD_NUMBER_FONT_STYLE,
  MANA_CONFIGS,
  MANA_CRYSTAL_POSITION,
  MANA_TEXT_POSITION,
} from '../utils/visual-configs'

export class Mana {
  private scene: Phaser.Scene
  private owner: TargetKeys
  private manaText: Phaser.GameObjects.Text
  private currentMana: number
  private maxMana: number
  private manaLimit: number
  private manaContainer: Phaser.GameObjects.Container | undefined

  constructor(scene: Phaser.Scene, owner: TargetKeys) {
    this.scene = scene
    this.owner = owner
    this.currentMana = 0
    this.maxMana = 0
    this.manaLimit = MAX_MANA

    this.createManaCrystals()
  }

  /**
   * Get current mana
   */
  public get getCurrentMana(): number {
    return this.currentMana
  }

  /**
   * Add a mana crystal if max mana is not reached
   */
  public addManaCrystal(): void {
    if (this.currentMana >= this.manaLimit) {
      return
    }

    this.maxMana += 1

    // If number too big, move text to the left
    if (this.maxMana >= 10) {
      this.manaText.setX(MANA_TEXT_POSITION[this.owner].x - 6)
    }

    // If player, add crystal
    if (this.manaContainer) {
      const manaCrystal = this.scene.add.image(0, 0, UI_ASSET_KEYS.MANA_CRYSTAL).setScale(0.08).setOrigin(0)
      const x = this.manaContainer.list.length * manaCrystal.width * manaCrystal.scale
      manaCrystal.setX(x)
      this.manaContainer.add(manaCrystal)
    }
  }

  /**
   * Recalculate mana then change mana crystals color
   */
  public useMana(usedMana: number): void {
    if (usedMana === 0) {
      return
    }

    this.currentMana -= usedMana
    this.manaText.setText(`${this.currentMana}/${this.maxMana}`)

    if (this.manaContainer) {
      let index = 0
      this.manaContainer?.iterate((manaCrystal: Phaser.GameObjects.Image) => {
        if (index >= this.currentMana) {
          manaCrystal.setTint(MANA_CONFIGS.TINT_EMPTY)
        }
        index++
      })
    }
  }

  /**
   * Refreshes mana to max
   */
  public refreshMana(): void {
    this.currentMana = this.maxMana
    this.manaText.setText(`${this.currentMana}/${this.maxMana}`)

    this.manaContainer?.iterate((manaCrystal: Phaser.GameObjects.Image) => {
      manaCrystal.setTint(MANA_CONFIGS.TINT_FULL)
    })
  }

  /**
   * Create Mana Crystals for player and Mana Text
   */
  private createManaCrystals(): void {
    this.manaText = this.scene.add
      .text(
        MANA_TEXT_POSITION[this.owner].x,
        MANA_TEXT_POSITION[this.owner].y,
        `${this.currentMana}/${this.maxMana}`,
        CARD_NUMBER_FONT_STYLE
      )
      .setOrigin(0)
      .setScale(0.5)

    if (this.owner === TARGET_KEYS.PLAYER) {
      this.manaContainer = this.scene.add.container(MANA_CRYSTAL_POSITION.x, MANA_CRYSTAL_POSITION.y)
    }
  }
}
