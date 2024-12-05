import { BATTLE_STATES, TARGET_KEYS, TargetKeys } from '../utils/keys'
import { HAND_CARD_SIZE, HandCard } from './card/hand-card'
import { CardData } from './card/card-keys'
import { BattleScene } from '../scenes/battle-scene'
import { CARD_ASSETS_KEYS } from '../assets/asset-keys'

const DECK_POSITION = Object.freeze({
  x: 1635,
  y: {
    PLAYER: 535,
    OPPONENT: 275,
  },
})

export class Deck {
  private scene: BattleScene
  private owner: TargetKeys
  private deck: HandCard[]
  private deckContainer: Phaser.GameObjects.Container

  constructor(scene: BattleScene, allCards: CardData[], owner: TargetKeys) {
    this.scene = scene
    this.owner = owner

    this.deck = this.createRandomDeck(allCards)
    this.shuffle()

    this.deckContainer = this.createDeckContainer()
  }

  /**
   * Remove top card and do flip animation then callback (draw card method in hand)
   */
  public drawCard(callback: (card: HandCard) => void): void {
    const drawnCard = this.deck.pop()
    if (!drawnCard) {
      return
    }

    // Flip Animation
    if (this.owner === TARGET_KEYS.PLAYER) {
      this.scene.tweens.add({
        targets: drawnCard.cardUI,
        scaleX: 0,
        duration: 300,
        ease: 'Cubic.easeIn',
        onComplete: () => {
          drawnCard.cardImageAsset = drawnCard.cardData.assetKey
          drawnCard.showFrontSide()
          this.scene.tweens.add({
            targets: drawnCard.cardUI,
            scaleX: HAND_CARD_SIZE.scale,
            duration: 300,
            ease: 'Cubic.easeOut',
            onComplete: () => {
              callback(drawnCard)
            },
          })
        },
      })
    } else {
      callback(drawnCard)
    }
  }

  /**
   * Create Deck UI
   */
  private createDeckContainer(): Phaser.GameObjects.Container {
    const deckContainer = this.scene.add.container(DECK_POSITION.x, DECK_POSITION.y[this.owner])
    const cardSpacing = 2

    for (let i = 0; i < this.deck.length; i++) {
      const card = this.deck[i]
      card.cardImageAsset = CARD_ASSETS_KEYS.CARD_BACK
      card.cardUI.setPosition(0, Math.max(-i, -5) * cardSpacing) // Max 5 cards visible on deck stack
      card.showCard()
      deckContainer.add(card.cardUI)
    }

    return deckContainer
  }

  /**
   * Create Random Deck
   */
  private createRandomDeck(allCards: CardData[]): HandCard[] {
    const deck = []
    const availableCards = [...allCards]

    for (let i = 0; i < allCards.length; i++) {
      const randomNumber = Math.floor(Math.random() * availableCards.length)
      const card = new HandCard(this.scene, availableCards.splice(randomNumber, 1)[0], this.owner)
      card.hideCard()
      deck.push(card)
    }

    return deck
  }

  /**
   * Shuffle Deck
   */
  private shuffle(): void {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]
    }
  }
}
