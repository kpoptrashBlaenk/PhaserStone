import { FONT_KEYS } from '../assets/font-keys'

export class Board {
  private scene: Phaser.Scene
  public endTurnButton: Phaser.GameObjects.Text
  private playerBoardContainer: Phaser.GameObjects.Container
  private enemyBoardContainer: Phaser.GameObjects.Container
  private playerHeroContainer: Phaser.GameObjects.Container
  private enemyHeroContainer: Phaser.GameObjects.Container
  private playerHandContainer: Phaser.GameObjects.Container
  private enemyHandContainer: Phaser.GameObjects.Container

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.createBoard()
  }

  private createBoard(): void {
    // ---------- Board ---------- //
    const handSpaceHeight = 100
    const BoardCenterThickness = 5
    const BoardHeight = this.scene.scale.height / 2 - handSpaceHeight - BoardCenterThickness
    const BoardColor = 0xf4c300

    const enemyBoard = this.scene.add
      .rectangle(0, 0, this.scene.scale.width, BoardHeight, BoardColor)
      .setOrigin(0)

    this.enemyBoardContainer = this.scene.add.container(0, handSpaceHeight)
    this.enemyBoardContainer.add(enemyBoard)

    const playerBoard = this.scene.add
      .rectangle(0, 0, this.scene.scale.width, BoardHeight, BoardColor)
      .setOrigin(0)

    this.playerBoardContainer = this.scene.add.container(
      0,
      this.scene.scale.height - handSpaceHeight - BoardHeight
    )
    this.playerBoardContainer.add(playerBoard)

    // ---------- Hero ---------- //
    const heroSize = 100
    const heroX = this.scene.scale.width / 2 - heroSize / 2
    const enemyHeroColor = 0xff0000
    const playerHeroColor = 0x00ff00

    const enemyHero = this.scene.add.rectangle(0, 0, heroSize, heroSize, enemyHeroColor).setOrigin(0)
    this.enemyHeroContainer = this.scene.add.container(heroX, 0, enemyHero)

    const playerHero = this.scene.add.rectangle(0, 0, heroSize, heroSize, playerHeroColor).setOrigin(0)
    this.playerHeroContainer = this.scene.add.container(heroX, this.scene.scale.height - heroSize, playerHero)

    // ---------- End Turn Button ---------- //
    this.createButton(handSpaceHeight, BoardHeight, BoardCenterThickness)

    // ---------- Hands ---------- //
    const handPadding = 20
    const handWidth = this.enemyHeroContainer.x - handPadding * 2

    const handFill1 = this.scene.add
      .rectangle(handPadding, handPadding / 2, handWidth, handSpaceHeight - handPadding, 0xa16eaa)
      .setOrigin(0)
    const handFill2 = this.scene.add
      .rectangle(handPadding, handPadding / 2, handWidth, handSpaceHeight - handPadding, 0xa16eaa)
      .setOrigin(0)

    this.enemyHandContainer = this.scene.add.container(0, 0, handFill1)
    this.playerHandContainer = this.scene.add.container(
      this.scene.scale.width - handWidth - handPadding * 2,
      this.scene.scale.height - handSpaceHeight - handPadding + handPadding,
      handFill2
    )
  }

  private createButton(handSpaceHeight: number, BoardHeight: number, BoardCenterThickness: number): void {
    const buttonWidth = 100
    const buttonHeight = 50
    const buttonColor = 0x0000ff
    const buttonHoverColor = 0x3399ff

    const button = this.scene.add.rectangle(0, 0, buttonWidth, buttonHeight, buttonColor).setOrigin(0.5) // Rectangle

    const buttonText = this.scene.add // Text
      .text(0, 0, 'End Turn', {
        fontSize: '20px',
        color: '#FFFFFF',
        fontFamily: FONT_KEYS.HEARTHSTONE,
      })
      .setOrigin(0.5)

    const buttonContainer = this.scene.add.container(
      this.scene.scale.width - buttonWidth / 2 - 5,
      handSpaceHeight + BoardHeight + BoardCenterThickness / 2
    )

    buttonContainer.add([button, buttonText]).setSize(buttonWidth, buttonHeight).setInteractive()

    // Button Click
    buttonContainer.on('pointerdown', () => {
      this.endTurn()
    })

    // Button Hover
    buttonContainer.on('pointerover', () => {
      button.setFillStyle(buttonHoverColor)
    })
    buttonContainer.on('pointerout', () => {
      button.setFillStyle(buttonColor)
    })
  }

  private endTurn(): void {
    console.log('Turn ended')
  }
}
