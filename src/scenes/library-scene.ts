import { DATA_ASSET_KEYS } from '../assets/asset-keys'
import { LibraryCard } from '../objects/library-card'
import { CardData } from '../utils/card-keys'
import { CARD_CONFIG } from '../utils/visual-configs'
import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'

export class LibraryScene extends BaseScene {
  private $allLoadedCards: CardData[]
  private $shownCards: LibraryCard[]
  private $currentPage: number
  private $maxPage: number
  private $libraryPage: Phaser.GameObjects.Rectangle

  constructor() {
    super({
      key: SCENE_KEYS.LIBRARY_SCENE,
    })
  }

  create() {
    super.create()

    this.$allLoadedCards = [...this.cache.json.get(DATA_ASSET_KEYS.CARDS)]
    this.$shownCards = []
    this.$currentPage = 0

    this.$createLibrary()
    this.$changePage(1)
    // this.$createCards()
  }

  private $changePage(page: 1 | -1) {
    this.$currentPage += page

    if (this.$shownCards.length > 0) {
      for (const card of this.$shownCards) {
        card.container.destroy(true)
      }
    }

    for (let i = 0; i < 10; i++) {
      const card = new LibraryCard(this, this.$allLoadedCards[i])
      card.setSide('FRONT')
      card.removeHover()
      card.container.setScale(0.7)
      card.container.setSize(card.container.width * 0.7, card.container.height * 0.7)

      const paddingX = (this.$libraryPage.width - card.container.width * 5) / 6
      const paddingY = (this.$libraryPage.height - card.container.height * 2) / 3
      const multiplierX = i < 5 ? i : i - 5
      const multiplierY = i < 5 ? 0 : 1

      card.container.setPosition(
        this.$libraryPage.x +
          card.container.width * multiplierX +
          paddingX * (multiplierX + 1) -
          card.container.width,
        this.$libraryPage.y +
          card.container.height * multiplierY +
          paddingY * (multiplierY + 1) -
          card.container.height
      )

      this.$shownCards.push(card)
    }

    CARD_CONFIG.SIZE.HEIGHT
    CARD_CONFIG.SIZE.WIDTH
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
    this.$libraryPage = this.add
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
        this.$libraryPage.x + this.$libraryPage.width / 2 - padding * 2,
        this.$libraryPage.y + this.$libraryPage.height + padding / 2,
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
        this.$libraryPage.x + this.$libraryPage.width / 2 + padding * 2,
        this.$libraryPage.y + this.$libraryPage.height + padding / 2,
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
        sceneWidth - this.$libraryPage.width - this.$libraryPage.x - padding * 2,
        this.$libraryPage.height,
        0x000000
      )
      .setOrigin(0)

    const cardListContainer = this.add
      .container(this.$libraryPage.x + this.$libraryPage.width + padding, this.$libraryPage.y, [
        cardListRectangle,
      ])
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
}
