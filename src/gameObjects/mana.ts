import { UI_ASSET_KEYS } from '../assets/asset-keys'
import { TARGET_KEYS, TargetKeys } from '../utils/keys'
import { CARD_NUMBER_FONT_STYLE } from './card/card'

const MANA_TEXT_POSITION = Object.freeze({
  PLAYER: {
    x: 1300,
    y: 910,
  },
  OPPONENT: {
    x: 1265,
    y: 80,
  },
})

const MANA_CRYSTAL_POSITION = Object.freeze({
  x: 1370,
  y: 910,
})

export class Mana {
  private scene: Phaser.Scene
  private owner: TargetKeys
  private manaText: Phaser.GameObjects.Text
  private currentMana: number
  private maxMana: number
  private manaContainer: Phaser.GameObjects.Container | undefined

  constructor(scene: Phaser.Scene, owner: TargetKeys) {
    this.scene = scene
    this.owner = owner
    this.currentMana = 0
    this.maxMana = 10

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
    if (this.currentMana >= this.maxMana) {
      return
    }

    this.currentMana += 1
    this.manaText.setText(`${this.currentMana}/${this.maxMana}`)

    // If number too big, move text to the left
    if (this.currentMana >= 10) {
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
      this.manaContainer = this.scene.add.container(1370, 910)
    }
  }
}
