import { CardAssetKeys } from '../assets/asset-keys'
import { FONT_KEYS } from '../assets/font-keys'
import { Card } from '../types/typedef'

const POSITIONS = Object.freeze({
  board: {
    centerThickness: 5,
    color: 0xf4c300,
  },
  hero: {
    size: 100,
    enemyColor: 0xff0000,
    playerColor: 0x00ff00,
  },
  hand: {
    height: 100,
    padding: 20,
  },
  endButton: {
    width: 100,
    height: 50,
    color: 0x0000ff,
    hoverColor: 0x3399ff,
  },
})

export class Board {
  private scene: Phaser.Scene
  public endTurnButton: Phaser.GameObjects.Text
  private playerBoardContainer: Phaser.GameObjects.Container
  private enemyBoardContainer: Phaser.GameObjects.Container
  private playerHeroContainer: Phaser.GameObjects.Container
  private enemyHeroContainer: Phaser.GameObjects.Container
  private playerHandContainer: Phaser.GameObjects.Container
  private enemyHandContainer: Phaser.GameObjects.Container
  private playerHand: Card[]

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.create()

    this.playerHand = []
  }

  private create(): void {
    // ---------- Boards ---------- //
    const boardHeight = this.scene.scale.height / 2 - POSITIONS.hand.height - POSITIONS.board.centerThickness

    this.enemyBoardContainer = this.createBoard(POSITIONS.hand.height, boardHeight)
    this.playerBoardContainer = this.createBoard(
      this.scene.scale.height - POSITIONS.hand.height - boardHeight,
      boardHeight
    )

    // ---------- Heroes ---------- //
    this.enemyHeroContainer = this.createHero(0, POSITIONS.hero.enemyColor)
    this.playerHeroContainer = this.createHero(
      this.scene.scale.height - POSITIONS.hero.size,
      POSITIONS.hero.playerColor
    )

    // ---------- End Turn Button ---------- //
    this.createButton(boardHeight)

    // ---------- Hands ---------- //
    const handWidth = this.enemyHeroContainer.x - POSITIONS.hand.padding * 2

    this.enemyHandContainer = this.createHand(0, 0, handWidth)
    this.playerHandContainer = this.createHand(
      this.scene.scale.width - handWidth - POSITIONS.hand.padding * 2,
      this.scene.scale.height - POSITIONS.hand.height - POSITIONS.hand.padding + POSITIONS.hand.padding,
      handWidth
    )
  }

  private createCardInHand(assetKey: CardAssetKeys) {
    const cardImage = this.scene.add.image(0, 0, assetKey).setScale(0.18).setOrigin(0)

    const scaledWidth = cardImage.width * cardImage.scaleX
    const scaledHeight = cardImage.height * cardImage.scaleY
    cardImage.setX(POSITIONS.hand.padding + this.playerHandContainer.width / 2 - scaledWidth / 2)
    cardImage.setY(POSITIONS.hand.padding / 2 + this.playerHandContainer.height / 2 - scaledHeight / 2)

    this.playerHandContainer.add(cardImage)
  }

  private createBoard(y: number, height: number): Phaser.GameObjects.Container {
    const board = this.scene.add
      .rectangle(0, 0, this.scene.scale.width, height, POSITIONS.board.color)
      .setOrigin(0)

    return this.scene.add.container(0, y).add(board).setSize(board.width, board.height)
  }

  private createHero(y: number, color: number): Phaser.GameObjects.Container {
    const heroX = this.scene.scale.width / 2 - POSITIONS.hero.size / 2
    const hero = this.scene.add.rectangle(0, 0, POSITIONS.hero.size, POSITIONS.hero.size, color).setOrigin(0)

    return this.scene.add.container(heroX, y, hero)
  }

  private createHand(x: number, y: number, width: number): Phaser.GameObjects.Container {
    const handFill = this.scene.add
      .rectangle(
        POSITIONS.hand.padding,
        POSITIONS.hand.padding / 2,
        width,
        POSITIONS.hand.height - POSITIONS.hand.padding,
        0xa16eaa
      )
      .setOrigin(0)

    return this.scene.add.container(x, y, handFill).setSize(handFill.width, handFill.height)
  }

  private createButton(boardHeight: number): void {
    const button = this.scene.add
      .rectangle(0, 0, POSITIONS.endButton.width, POSITIONS.endButton.height, POSITIONS.endButton.color)
      .setOrigin(0.5) // Rectangle

    const buttonText = this.scene.add // Text
      .text(0, 0, 'End Turn', {
        fontSize: '20px',
        color: '#FFFFFF',
        fontFamily: FONT_KEYS.HEARTHSTONE,
      })
      .setOrigin(0.5)

    const buttonContainer = this.scene.add.container(
      this.scene.scale.width - POSITIONS.endButton.width / 2 - 5,
      POSITIONS.hand.height + boardHeight + POSITIONS.board.centerThickness / 2
    )

    buttonContainer
      .add([button, buttonText])
      .setSize(POSITIONS.endButton.width, POSITIONS.endButton.height)
      .setInteractive()

    // Button Click
    buttonContainer.on('pointerdown', () => {
      this.endTurn()
    })

    // Button Hover
    buttonContainer.on('pointerover', () => {
      button.setFillStyle(POSITIONS.endButton.hoverColor)
    })
    buttonContainer.on('pointerout', () => {
      button.setFillStyle(POSITIONS.endButton.color)
    })
  }

  private endTurn(): void {
    console.log('Turn ended')
  }

  public addCardToPlayerHand(card: Card | undefined): void {
    if (card) {
      // Numeric Hand
      this.playerHand.push(card)

      // Visual Hand
      this.createCardInHand(card.assetKey)
    }
  }
}
