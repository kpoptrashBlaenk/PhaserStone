import { CARD_ASSETS_KEYS, EFFECT_ASSET_KEYS, UI_ASSET_KEYS } from '../assets/asset-keys'
import { setOutline } from '../common/outline'
import { CardData } from '../utils/card-keys'
import { STATES, TARGET_KEYS, TargetKeys } from '../utils/keys'
import { StateMachine } from '../utils/state-machine'
import { ANIMATION_CONFIG, BOARD_CONFIG, CARD_CONFIG } from '../utils/visual-configs'

export class Card {
  private $scene: Phaser.Scene
  private $stateMachine: StateMachine
  private $cardData: CardData
  private $originalData: CardData
  private $owner: TargetKeys
  private $cardContainer: Phaser.GameObjects.Container
  private $cardTemplateImage: Phaser.GameObjects.Image
  private $cardPortraitImage: Phaser.GameObjects.Image
  private $cardNameText: Phaser.GameObjects.Text
  private $cardCostText: Phaser.GameObjects.Text
  private $cardAttackText: Phaser.GameObjects.Text
  private $cardHealthText: Phaser.GameObjects.Text
  private $previewContainer: Phaser.GameObjects.Container
  private $cancelButton: Phaser.GameObjects.Image
  private $sickParticles: Phaser.GameObjects.Particles.ParticleEmitter | null = null
  private $playable: boolean
  private $attacked: boolean
  private $sick: boolean

  constructor(scene: Phaser.Scene, stateMachine: StateMachine, cardData: CardData, owner: TargetKeys) {
    this.$scene = scene
    this.$stateMachine = stateMachine
    this.$cardData = cardData
    this.$originalData = Object.freeze({ ...cardData })
    this.$owner = owner

    this.$playable = false
    this.$attacked = false
    this.$sick = true

    this.$cardContainer = this.$createCard()
    this.$resizeCard(this.$cardContainer)
  }

  public get container(): Phaser.GameObjects.Container {
    return this.$cardContainer
  }

  public get portrait(): Phaser.GameObjects.Image {
    return this.$cardPortraitImage
  }

  public get template(): Phaser.GameObjects.Image {
    return this.$cardTemplateImage
  }

  public get card(): CardData {
    return this.$cardData
  }

  public get player(): TargetKeys {
    return this.$owner
  }

  public get isPlayable(): boolean {
    return this.$playable
  }

  public get canAttack(): boolean {
    return !this.$attacked && !this.$sick
  }

  public setAttacked(attacked: boolean) {
    this.$attacked = attacked
    this.setOutline(this.canAttack)
  }

  public setSick(sick: boolean) {
    this.$sick = sick
    this.setOutline(this.canAttack)

    if (sick) {
      this.$sickParticles = this.$sickAnimation()
      this.$cardContainer.add(this.$sickParticles)
      this.setOutline(false)
      return
    }

    this.$sickParticles?.destroy()
  }

  public setPlayable(activatable: boolean): void {
    this.$playable = activatable
    this.setOutline(activatable)
  }

  public setHealth(newHealth: number): void {
    this.$cardData.health = newHealth
  }

  public setOutline(value: boolean): void {
    if (this.$owner === TARGET_KEYS.PLAYER) {
      setOutline(this.$scene, value, this.$cardTemplateImage)
    }
  }

  /**
   * Show front or back
   */
  public setSide(side: 'FRONT' | 'BACK'): void {
    if (side === 'FRONT') {
      this.$cardPortraitImage.setTexture(this.$cardData.assetKey)
      this.$cardCostText.setAlpha(1)
      this.$cardAttackText.setAlpha(1)
      this.$cardHealthText.setAlpha(1)
      this.$cardNameText.setAlpha(1)
      this.$cardTemplateImage.setAlpha(1)
      this.$cardPortraitImage.setScale(CARD_CONFIG.SIZE.PORTRAIT_SCALE)
      this.$cardPortraitImage.setY(this.$cardTemplateImage.height / 3.3)
      this.$cardTemplateImage.setInteractive({
        cursor: 'pointer',
      })
      this.$createHover()
      return
    }

    this.$cardPortraitImage.setTexture(CARD_ASSETS_KEYS.CARD_BACK)
    this.$cardCostText.setAlpha(0)
    this.$cardAttackText.setAlpha(0)
    this.$cardHealthText.setAlpha(0)
    this.$cardNameText.setAlpha(0)
    this.$cardTemplateImage.setAlpha(0)
    this.$cardPortraitImage.setScale(1)
  }

  /**
   * Set interactions for context
   */
  public setContext(context: 'HAND' | 'BOARD'): void {
    this.$cardTemplateImage.removeListener('pointerup')

    switch (context) {
      case 'HAND':
        this.$addClickHand()
        this.$handCard()
        break
      case 'BOARD':
        this.$addClickBoard()
        this.$boardCard()
        break
    }
  }

  /**
   * Mark or remove mark if this is a valid target
   */
  public setTarget(targeted: boolean): void {
    if (targeted) {
      this.$cardTemplateImage.setTint(0xff0000)
    } else {
      this.$cardTemplateImage.setTint(0xffffff)
    }
  }

  /**
   * Creates card objects
   */
  private $createCard(): Phaser.GameObjects.Container {
    // Image
    this.$cardTemplateImage = this.$scene.add.image(0, 0, CARD_ASSETS_KEYS.TEMPLATE)
    this.$cardTemplateImage.setPosition(this.$cardTemplateImage.width / 2, this.$cardTemplateImage.height / 2)

    this.$cardPortraitImage = this.$scene.add
      .image(0, 0, this.$cardData.assetKey)
      .setSize(this.$cardTemplateImage.width / 2, this.$cardTemplateImage.height / 2)
      .setDepth(-1)
      .setScale(CARD_CONFIG.SIZE.PORTRAIT_SCALE)

    // Cost
    this.$cardCostText = this.$scene.add.text(
      CARD_CONFIG.POSITION.COST.X,
      CARD_CONFIG.POSITION.COST.Y,
      String(this.$cardData.cost),
      CARD_CONFIG.FONT_STYLE.NUMBER
    )

    // Attack
    this.$cardAttackText = this.$scene.add.text(
      CARD_CONFIG.POSITION.ATTACK.X,
      CARD_CONFIG.POSITION.ATTACK.Y,
      String(this.$cardData.attack),
      CARD_CONFIG.FONT_STYLE.NUMBER
    )

    // Health
    this.$cardHealthText = this.$scene.add.text(
      CARD_CONFIG.POSITION.HEALTH.X,
      CARD_CONFIG.POSITION.HEALTH.Y,
      String(this.$cardData.health),
      CARD_CONFIG.FONT_STYLE.NUMBER
    )

    // Name
    this.$cardNameText = this.$scene.add
      .text(
        this.$cardTemplateImage.x,
        CARD_CONFIG.POSITION.NAME.Y,
        this.$cardData.name,
        this.$cardData.name.length < 10 ? CARD_CONFIG.FONT_STYLE.NAME.SMALL : CARD_CONFIG.FONT_STYLE.NAME.BIG
      )
      .setOrigin(0.5)

    // Container
    const container = this.$scene.add
      .container(0, 0)
      .setSize(this.$cardTemplateImage.width, this.$cardTemplateImage.height)
    this.$cardPortraitImage.setPosition(this.$cardTemplateImage.width / 2, this.$cardTemplateImage.height / 2)

    container.add([
      this.$cardPortraitImage,
      this.$cardTemplateImage,
      this.$cardCostText,
      this.$cardAttackText,
      this.$cardHealthText,
      this.$cardNameText,
    ])

    return container
  }

  /**
   * Creates preview objects
   */
  private $createPreview(): Phaser.GameObjects.Container {
    // Image
    const template = this.$scene.add.image(0, 0, CARD_ASSETS_KEYS.TEMPLATE)
    template.setPosition(template.width / 2, template.height / 2)

    const portrait = this.$scene.add
      .image(0, 0, this.$cardData.assetKey)
      .setSize(template.width / 2, template.height / 2)
      .setDepth(-1)
      .setScale(CARD_CONFIG.SIZE.PORTRAIT_SCALE)

    // Cost
    const cost = this.$scene.add.text(
      CARD_CONFIG.POSITION.COST.X,
      CARD_CONFIG.POSITION.COST.Y,
      String(this.$cardData.cost),
      CARD_CONFIG.FONT_STYLE.NUMBER
    )

    // Attack
    const attack = this.$scene.add.text(
      CARD_CONFIG.POSITION.ATTACK.X,
      CARD_CONFIG.POSITION.ATTACK.Y,
      String(this.$cardData.attack),
      CARD_CONFIG.FONT_STYLE.NUMBER
    )

    // Health
    const health = this.$scene.add.text(
      CARD_CONFIG.POSITION.HEALTH.X,
      CARD_CONFIG.POSITION.HEALTH.Y,
      String(this.$cardData.health),
      CARD_CONFIG.FONT_STYLE.NUMBER
    )

    // Name
    const name = this.$scene.add
      .text(
        template.x,
        CARD_CONFIG.POSITION.NAME.Y,
        this.$cardData.name,
        this.$cardData.name.length < 10 ? CARD_CONFIG.FONT_STYLE.NAME.SMALL : CARD_CONFIG.FONT_STYLE.NAME.BIG
      )
      .setOrigin(0.5)

    // Container
    const container = this.$scene.add.container(0, 0).setSize(template.width, template.height)
    portrait.setPosition(template.width / 2, template.height / 2)

    container.add([portrait, template, cost, attack, health, name])

    return container
  }

  /**
   * Resize card and card objects
   */
  private $resizeCard(container: Phaser.GameObjects.Container): void {
    container.setScale(CARD_CONFIG.SIZE.SCALE)
    container.setSize(
      this.$cardTemplateImage.width * container.scaleX,
      this.$cardTemplateImage.height * container.scaleY
    )
  }

  /**
   * Pointerover: Create preview to right top
   * Pointerout: Destroy hover
   */
  private $createHover(): void {
    this.$cardTemplateImage.on('pointerover', () => {
      this.$previewContainer = this.$createPreview()
      this.$resizeCard(this.$previewContainer)
      this.$previewContainer.setScale(1.5)
      const x = this.$cardContainer.getBounds().x - this.$cardContainer.x + 650
      this.$previewContainer.setX(x)
    })

    this.$cardTemplateImage.on('pointerout', () => {
      this.$previewContainer.destroy()
    })
  }

  /**
   * Pointerup: If not dragging -> drag. If dragging -> Check if on board -> Return to hand | Play card
   */
  private $addClickHand(): void {
    if (this.$owner === TARGET_KEYS.PLAYER) {
      // Player Turn
      this.$cardTemplateImage.on('pointerup', (pointer: Phaser.Input.Pointer) => {
        // Callback and Fallback for playing card
        const playCardCallback = () => {
          this.$removeCancel()
          this.$stateMachine.setState(STATES.PLAYER_PLAY_CARD, this)
        }
        const playCardFallback = () => {
          this.$cardContainer.setPosition(
            this.$cardContainer.getData('position').container.x,
            this.$cardContainer.getData('position').container.y
          )
          this.$removeCancel()
        }
        const cleanInteractions = () => {
          this.$cardContainer.setData('draggingFromHand', false).setDepth(0)
          this.$scene.input.removeListener('pointermove')
          this.$previewContainer.destroy()
        }

        if (this.$stateMachine.currentStateName === STATES.PLAYER_TURN && this.$playable) {
          if (!this.$cardContainer.getData('draggingFromHand')) {
            // Dragging is false
            this.$cardContainer.setData('draggingFromHand', true).setDepth(1)
            this.$cardContainer.setData('position', {
              container: {
                x: this.$cardContainer.x,
                y: this.$cardContainer.y,
              },
              pointer: {
                x: pointer.x,
                y: pointer.y,
              },
            })

            // Add dragging
            this.$scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
              this.$cardContainer.x =
                this.$cardContainer.getData('position').container.x +
                (pointer.x - this.$cardContainer.getData('position').pointer.x)
              this.$cardContainer.y =
                this.$cardContainer.getData('position').container.y +
                (pointer.y - this.$cardContainer.getData('position').pointer.y)
            })
            return
          }

          // Dragging is true
          this.$cardContainer.setData('draggingFromHand', false).setDepth(0)

          // Check if on board
          if (
            !(
              pointer.x >= BOARD_CONFIG.BOUNDS.START_X &&
              pointer.x <= BOARD_CONFIG.BOUNDS.END_X &&
              pointer.y >= BOARD_CONFIG.BOUNDS.START_Y &&
              pointer.y <= BOARD_CONFIG.BOUNDS.END_Y
            )
          ) {
            // Return to Hand
            playCardFallback()
            cleanInteractions()
            return
          }

          // If battlecry, set state and pass what happens if battlecry passes or not
          if (this.$cardData.battlecry) {
            this.$addCancel()
            this.$stateMachine.setState(STATES.PLAYER_BATTLECRY, {
              card: this,
              callback: playCardCallback,
              fallback: playCardFallback,
            })

            cleanInteractions()
            return
          }

          playCardCallback()
          cleanInteractions()
        }

        // Cancel battlecry target clicked has cancel button
        if (this.$stateMachine.currentStateName === STATES.PLAYER_CHOOSE_TARGET) {
          if (this.$cancelButton) {
            playCardFallback()
            this.$stateMachine.setState(STATES.PLAYER_TURN)
          }
        }
      })

      return
    }
  }

  private $handCard(): void {
    this.$playable = false
  }

  private $addClickBoard(): void {
    this.$cardTemplateImage.on('pointerup', () => {
      if (this.$stateMachine.currentStateName === STATES.PLAYER_CHOOSE_TARGET) {
        this.$stateMachine.setState(STATES.PLAYER_TARGET_CHOSEN, this)
      }
    })
  }

  private $boardCard(): void {
    this.setAttacked(false)
    this.setSick(true)
  }

  private $addCancel(): void {
    this.$cancelButton = this.$scene.add
      .image(this.$cardTemplateImage.width / 2, this.$cardTemplateImage.height / 2, UI_ASSET_KEYS.CANCEL)
      .setScale(0.8)
      .setAlpha(1)
      .setOrigin(0.5)

    this.$cardContainer.add(this.$cancelButton)
  }

  private $removeCancel(): void {
    if (this.$cancelButton) {
      this.$cancelButton.destroy()
    }
  }

  private $sickAnimation(): Phaser.GameObjects.Particles.ParticleEmitter {
    return this.$scene.add.particles(
      ANIMATION_CONFIG.SICK.POSITION.X,
      ANIMATION_CONFIG.SICK.POSITION.Y,
      EFFECT_ASSET_KEYS.Z,
      {
        scale: { start: ANIMATION_CONFIG.SICK.SCALE.START, end: ANIMATION_CONFIG.SICK.SCALE.END },
        speed: ANIMATION_CONFIG.SICK.SPEED,
        lifespan: ANIMATION_CONFIG.SICK.LIFESPAN,
        frequency: ANIMATION_CONFIG.SICK.FREQUENCY,
        angle: { min: ANIMATION_CONFIG.SICK.ANGLE.MIN, max: ANIMATION_CONFIG.SICK.ANGLE.MAX },
        gravityY: ANIMATION_CONFIG.SICK.GRAVITY_Y,
        accelerationX: ANIMATION_CONFIG.SICK.ACCELERATION_X,
        accelerationY: ANIMATION_CONFIG.SICK.ACCELERATION_Y,
      }
    )
  }
}
