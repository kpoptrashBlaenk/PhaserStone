import { DATA_ASSET_KEYS } from '../assets/asset-keys'
import { LibraryCard } from '../objects/library-card'
import { CARD_CONFIG } from '../utils/visual-configs'
import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'

export class LibraryScene extends BaseScene {
  constructor() {
    super({
      key: SCENE_KEYS.LIBRARY_SCENE,
    })
  }

  create() {
    super.create()

    this.$createLibrary()
    // this.$createCards()
  }

  private $createLibrary() {
    const sceneWidth = this.scale.width
    const sceneHeight = this.scale.height
    const padding = 50

    // Add brown background
    this.cameras.main.setBackgroundColor('#8B4513')

    // Add title
    const libraryText = this.add.text(0, padding, 'Library', {
      ...CARD_CONFIG.FONT_STYLE.NUMBER,
      color: '#000000',
      strokeThickness: 3,
      fontSize: '100px',
    })
    libraryText.setX(sceneWidth / 2 - libraryText.width / 2)

    // Add beige background for cards
    const cardBackground = this.add
      .rectangle(
        padding,
        libraryText.y + libraryText.height + padding,
        (sceneWidth * 2) / 3,
        (sceneHeight * 2) / 3,
        0xf5f5dc
      )
      .setOrigin(0)

    // Add left arrow
    this.add
      .rectangle(
        cardBackground.x + cardBackground.width / 2 - padding * 2,
        cardBackground.y + cardBackground.height + padding / 2,
        padding,
        padding,
        0x000000
      )
      .setInteractive({ cursor: 'pointer' })
      .on('pointerdown', () => {})
      .setOrigin(0)

    // Add right arrow
    this.add
      .rectangle(
        cardBackground.x + cardBackground.width / 2 + padding * 2,
        cardBackground.y + cardBackground.height + padding / 2,
        padding,
        padding,
        0x000000
      )
      .setInteractive({ cursor: 'pointer' })
      .on('pointerdown', () => {})
      .setOrigin(0)

    // Add card list
    const cardListRectangle = this.add
      .rectangle(
        0,
        0,
        sceneWidth - cardBackground.width - cardBackground.x - padding * 2,
        cardBackground.height,
        0x000000
      )
      .setOrigin(0)

    const cardListContainer = this.add
      .container(cardBackground.x + cardBackground.width + padding, cardBackground.y, [cardListRectangle])
      .setSize(cardListRectangle.width, cardListRectangle.height)

    // Add card counter
    const cardCounterBackground = this.add
      .rectangle(
        cardListContainer.x,
        cardListContainer.y + cardListContainer.height + padding / 2,
        200,
        50,
        0x0000ff
      )
      .setOrigin(0)

    const cardCounterText = this.add
      .text(
        cardCounterBackground.x + cardCounterBackground.width / 2,
        cardCounterBackground.y + cardCounterBackground.height / 2,
        '0/30',
        {
          ...CARD_CONFIG.FONT_STYLE.NUMBER,
          color: '#000000',
          strokeThickness: 2,
        }
      )
      .setOrigin(0.5)

    // Add start button
    const startButton = this.add
      .rectangle(0, cardListContainer.y + cardListContainer.height + padding / 2, 200, 50, 0x0000ff)
      .setOrigin(0)
    startButton.setX(cardListContainer.x + cardListContainer.width - startButton.width)

    const startButtonText = this.add
      .text(startButton.x + startButton.width / 2, startButton.y + startButton.height / 2, 'Start', {
        ...CARD_CONFIG.FONT_STYLE.NUMBER,
        color: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5)
  }

  private $createCards() {
    const library = []
    const allCards = [...this.cache.json.get(DATA_ASSET_KEYS.CARDS)]
    const availableCards = [...allCards]

    for (let i = 0; i < allCards.length; i++) {
      const card = new LibraryCard(this, availableCards[0])
      library.push(card)
      card.setSide('FRONT')
    }
  }
}
