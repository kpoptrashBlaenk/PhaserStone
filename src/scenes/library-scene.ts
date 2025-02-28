import { DATA_ASSET_KEYS } from '../assets/asset-keys'
import { LibraryCard } from '../objects/library-card'
import { CardData } from '../utils/card-keys'
import { MAX_DECK } from '../utils/configs'
import { CARD_CONFIG } from '../utils/visual-configs'
import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'

/**
 * LibraryScene extends {@link BaseScene}
 *
 * This scene shows all cards available and lets the user choose cards to use in the players deck.
 */
export class LibraryScene extends BaseScene {
  private $allLoadedCards: CardData[]
  private $shownCards: LibraryCard[]
  private $selectedCards: Phaser.GameObjects.Container[]
  private $currentPage: number
  private $maxPage: number
  private $libraryPage: Phaser.GameObjects.Rectangle
  private $libraryList: Phaser.GameObjects.Container
  private $cardCounter: Phaser.GameObjects.Text
  private $startButton: Phaser.GameObjects.Rectangle

  constructor() {
    super({
      key: SCENE_KEYS.LIBRARY_SCENE,
    })
  }

  create() {
    super.create()
    this.$allLoadedCards = [...this.cache.json.get(DATA_ASSET_KEYS.CARDS)]

    this.$shownCards = []
    this.$selectedCards = []
    this.$currentPage = 0
    this.$maxPage = Math.floor(this.$allLoadedCards.length / 10)

    this.$createLibrary()
    this.$changePage(1)
  }

  /**
   * When page changes, delete all {@link LibraryCard}s and place new ones.
   *
   * @param page 1 for next and -1 for previous page
   * @returns
   */
  private $changePage(page: 1 | -1): void {
    // If page = 0 or if page = max, stay on the same page
    if (this.$currentPage + page <= 0 || this.$currentPage + page > this.$maxPage) {
      return
    }

    this.$currentPage += page

    // Delete all shown cards
    if (this.$shownCards.length > 0) {
      for (const card of this.$shownCards) {
        card.container.destroy(true)
      }
    }

    // Create the new 10 cards and order them in the library
    for (let i = 0; i < 10; i++) {
      const card = new LibraryCard(this, this.$allLoadedCards[i + 10 * (this.$currentPage - 1)])
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

      // Add click to card
      this.$cardClick(card)

      // Attach the card name to the container for each card
      this.$selectedCards.forEach((selectedCard) => {
        if (selectedCard.getData('card').card.name === card.card.name) {
          this.$cardSelected(card)
        }
      })
    }
  }

  /**
   * OnClick: Add to invoke {@link $addSelectedCard()} and {@link $cardSelected()}
   *
   * @param card {@link LibraryCard} to add the click to
   */
  private $cardClick(card: LibraryCard): void {
    card.template.on('pointerdown', () => {
      if (this.$selectedCards.length === MAX_DECK) {
        return
      }

      this.$addSelectedCard(card)
      this.$cardSelected(card)
    })
  }

  /**
   * Tint the card portrait and disable interactivity.
   *
   * @param card Selected {@link LibraryCard}
   */
  private $cardSelected(card: LibraryCard): void {
    card.portrait.setTint(0x808080)
    card.template.setTint(0x808080)

    card.template.disableInteractive()
    this.input.setDefaultCursor('default')
  }

  /**
   * Reset card portrait tint and enable interactivity.
   *
   * @param card Unselected {@link LibraryCard}
   */
  private $cardUnselected(card: LibraryCard): void {
    card.portrait.setTint(0xffffff)
    card.template.setTint(0xffffff)

    card.template.setInteractive()
  }

  /**
   * Create the whole library interface with all its objects.
   */
  private $createLibrary(): void {
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
      .on('pointerdown', () => this.$changePage(-1))
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
      .on('pointerdown', () => this.$changePage(1))
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

    this.$libraryList = this.add
      .container(this.$libraryPage.x + this.$libraryPage.width + padding, this.$libraryPage.y, [
        cardListRectangle,
      ])
      .setSize(cardListRectangle.width, cardListRectangle.height)

    // Add card counter
    const cardCounterBackground = this.add
      .rectangle(
        this.$libraryList.x,
        this.$libraryList.y + this.$libraryList.height + padding / 2,
        200,
        50,
        0x0000ff
      )
      .setOrigin(0)

    this.$cardCounter = this.add
      .text(
        cardCounterBackground.x + cardCounterBackground.width / 2,
        cardCounterBackground.y + cardCounterBackground.height / 2,
        `0/${MAX_DECK}`,
        {
          ...CARD_CONFIG.FONT_STYLE.NUMBER,
          color: '#000000',
          strokeThickness: 0,
        }
      )
      .setOrigin(0.5)

    // Add start button
    this.$startButton = this.add
      .rectangle(0, this.$libraryList.y + this.$libraryList.height + padding / 2, 200, 50, 0xff0000)
      .setOrigin(0)
      // OnClick: Start BattleScene and pass all selected cards as data
      .on('pointerup', () => {
        this.scene.start(SCENE_KEYS.BATTLE_SCENE, {
          deck: this.$selectedCards.map((card) => card.getData('card').card),
        })
      })
    this.$startButton.setX(this.$libraryList.x + this.$libraryList.width - this.$startButton.width)

    const startButtonText = this.add
      .text(
        this.$startButton.x + this.$startButton.width / 2,
        this.$startButton.y + this.$startButton.height / 2,
        'Start',
        {
          ...CARD_CONFIG.FONT_STYLE.NUMBER,
          color: '#000000',
          strokeThickness: 2,
        }
      )
      .setOrigin(0.5)
  }

  /**
   * Create a rectangle with name and insert into the deck list that removes itself when clicked
   *
   * @param card Card to add into deck
   */
  private $addSelectedCard(card: LibraryCard): void {
    const padding = 5
    const height = (this.$libraryList.height - padding * (MAX_DECK - 1)) / MAX_DECK

    const rectangle = this.add.rectangle(0, 0, this.$libraryList.width, height, 0xffffff).setOrigin(0)

    const name = this.add
      .text(rectangle.x + rectangle.width / 2, rectangle.y + rectangle.height / 2, card.card.name, {
        ...CARD_CONFIG.FONT_STYLE.NUMBER,
        color: '#000000',
        strokeThickness: 0,
        fontSize: '20px',
      })
      .setOrigin(0.5)

    const container = this.add.container(0, 0, [rectangle, name]).setSize(rectangle.width, rectangle.height)
    container.setData('card', card)
    // OnClick: Unselected the card and destroy the container then resize the deck list
    container.setInteractive({ cursor: 'pointer' }).on('pointerdown', () => {
      this.$selectedCards = this.$selectedCards.filter((selectedCard) => selectedCard !== container)
      this.$cardUnselected(container.getData('card'))
      container.destroy(true)
      this.$resizeList()
      this.$updateCardCounter()
    })

    this.$selectedCards.push(container)
    this.$libraryList.add(container)

    this.$resizeList()
    this.$updateCardCounter()
  }

  /**
   * Reorder deck list.
   */
  private $resizeList(): void {
    let i = 0

    this.$libraryList.iterate((child: Phaser.GameObjects.Container) => {
      if (child.type === 'Container') {
        child.setPosition(0, i * (child.height + 5))
        i++
      }
    })
  }

  /**
   * Update the counter of selected cards and check if max cards are selected or not.
   */
  private $updateCardCounter(): void {
    this.$cardCounter.setText(`${this.$selectedCards.length}/${MAX_DECK}`)

    this.$selectedCards.length === MAX_DECK
      ? this.$startButton.setInteractive({ cursor: 'pointer' }).setFillStyle(0x00ff00)
      : this.$startButton.disableInteractive().setFillStyle(0xff0000)
  }
}
