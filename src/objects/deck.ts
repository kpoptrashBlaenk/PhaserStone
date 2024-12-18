import { CARD_ASSETS_KEYS, DATA_ASSET_KEYS } from '../assets/asset-keys'
import { TargetKeys } from '../utils/keys'
import { DECK_CONFIG } from '../utils/visual-configs'
import { Card } from './card'

export class Deck {
  private $scene: Phaser.Scene
  private $owner: TargetKeys
  private $deck: Card[]
  private $deckContainer: Phaser.GameObjects.Container

  constructor(scene: Phaser.Scene, owner: TargetKeys) {
    this.$scene = scene
    this.$owner = owner

    this.$createDeck()
    this.$shuffle()

    this.$createContainer()
  }

  /**
   * Create card classes for each card in deck
   */
  private $createDeck(): void {
    const deck = []
    const allCards = this.$scene.cache.json.get(DATA_ASSET_KEYS.CARDS)
    const availableCards = [...allCards]

    for (let i = 0; i < allCards.length; i++) {
      const randomNumber = Math.floor(Math.random() * availableCards.length)
      const card = new Card(this.$scene, availableCards.splice(randomNumber, 1)[0], this.$owner)
      //   card.hideCard()
      deck.push(card)
    }

    this.$deck = deck
  }

  /**
   * Shuffle deck
   */
  private $shuffle(): void {
    for (let i = this.$deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.$deck[i], this.$deck[j]] = [this.$deck[j], this.$deck[i]]
    }
  }

  /**
   * Create deck ui
   */
  private $createContainer(): void {
    this.$deckContainer = this.$scene.add.container(
      DECK_CONFIG.POSITION.X,
      DECK_CONFIG.POSITION.Y[this.$owner]
    )

    for (let i = 0; i < this.$deck.length; i++) {
      const card = this.$deck[i]
      card.container.setPosition(0, Math.max(-i, -DECK_CONFIG.MAX_VISIBLE) * DECK_CONFIG.POSITION.SPACING) // Max 5 cards visible on deck stack
      card.setSide('BACK')
      this.$deckContainer.add(card.container)
    }
  }
}
