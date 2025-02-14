import { EFFECT_ASSET_KEYS, UI_ASSET_KEYS } from '../assets/asset-keys'
import { setOutline } from '../common/outline'
import { colorStat } from '../common/stats-change'
import { warningMessage } from '../common/warning'
import { CardData } from '../utils/card-keys'
import { STATES, TARGET_KEYS, TargetKeys, WARNING_KEYS } from '../utils/keys'
import { StateMachine } from '../utils/state-machine'
import { ANIMATION_CONFIG, BOARD_CONFIG } from '../utils/visual-configs'
import { BaseCard } from './base-card'

/**
 * Card class for BattleScene, which is used in Deck, Hand and Board
 */
export class Card extends BaseCard {
  private $stateMachine: StateMachine
  private $owner: TargetKeys
  private $cancelButton: Phaser.GameObjects.Image
  private $sickParticles: Phaser.GameObjects.Particles.ParticleEmitter | null = null
  private $playable: boolean
  private $attacked: boolean
  private $sick: boolean

  constructor(
    scene: Phaser.Scene,
    stateMachine: StateMachine,
    cardData: CardData,
    owner: TargetKeys,
    id: string
  ) {
    // Create card
    super(scene, cardData)
    // By default all cards are not playable/hasn't attack/summoning sick
    this.$stateMachine = stateMachine
    this.$owner = owner
    this.$playable = false
    this.$attacked = false
    this.$sick = true

    // Id for each card to difference them
    this._cardContainer.setData('id', id)
    this._cardData.trackId = id
  }

  /**
   * Return original stats of card
   */
  public get original(): CardData {
    return this._originalData
  }

  /**
   * Return owner of card
   */
  public get player(): TargetKeys {
    return this.$owner
  }

  /**
   * Return if card is playable
   */
  public get isPlayable(): boolean {
    return this.$playable
  }

  /**
   * Return if card can attack (hasn't attacked & is not sick)
   */
  public get canAttack(): boolean {
    return !this.$attacked && !this.$sick
  }

  /**
   * Set attacked and then outline
   * 
   * @param attacked If card has attacked this turn or not
   */
  public setAttacked(attacked: boolean) {
    this.$attacked = attacked
    this.setOutline(this.canAttack)
  }

  /**
   * Set sick, outline and {@link $sickAnimation()}
   */
  public setSick(sick: boolean) {
    this.$sick = sick

    if (sick) {
      this.$sickParticles = this.$sickAnimation()
      this._cardContainer.add(this.$sickParticles)
      this.setOutline(false)
      return
    }

    this.setOutline(this.canAttack)
    this.$sickParticles?.destroy()
  }

  /**
   * Set playable and outline
   * 
   * @param activatable If card can be played
   */
  public setPlayable(activatable: boolean): void {
    this.$playable = activatable
    this.setOutline(activatable)
  }

  /**
   * Set health and {@link colorStat()}
   * 
   * @param newHealth New health of card
   */
  public setHealth(newHealth: number): void {
    this._cardData.health = newHealth

    colorStat(this._cardData.health, this._originalData.health, this._cardHealthText)
  }

  /**
   * Set attack and {@link colorStat()}
   * 
   * @param newAttack New attack of card
   */
  public setAttack(newAttack: number): void {
    this._cardData.attack = newAttack

    colorStat(this._cardData.attack, this._originalData.attack, this._cardAttackText)
  }

  /**
   * Sets {@link setOutline()} around the template image
   * 
   * @param value If set or destroy outline
   */
  public setOutline(value: boolean): void {
    if (this.$owner === TARGET_KEYS.PLAYER) {
      setOutline(this._scene, value, this._cardTemplateImage)
    }
  }

  /**
   * Remove click then call {@link $addClickHand()}/{@link $addClickBoard()} and {@link $handCard()}/{@link $boardCard()}
   * 
   * @param context If card is in hand or board
   */
  public setContext(context: 'HAND' | 'BOARD'): void {
    this._cardTemplateImage.removeListener('pointerup')

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
   * Set tint of card to normal or red
   * 
   * @param targeted If card is targeted or not
   */
  public setTarget(targeted: boolean): void {
    if (targeted) {
      this._cardTemplateImage.setTint(0xff0000)
    } else {
      this._cardTemplateImage.setTint(0xffffff)
    }
  }

  /**
   * Destroy the preview container to avoid it being stuck since there was no manual pointer out
   */
  public die(): void {
    if (this._previewContainer) {
      this._previewContainer.destroy()
    }
  }

  /**
   * If player's turn and card is playable, drag card and remember original position
   * 
   * If player's turn and card is being dragged play it if on board
   * 
   * If battlecry then choose battlecry target, then battlecry manager and add cancel button, if valid target cancel if not play
   */
  private $addClickHand(): void {
    if (this.$owner === TARGET_KEYS.PLAYER) {
      // Player Turn
      this._cardTemplateImage.on('pointerup', (pointer: Phaser.Input.Pointer) => {
        // Callback and Fallback for playing card
        const playCardCallback = () => {
          this.$removeCancel()
          this.$stateMachine.setState(STATES.PLAYER_PLAY_CARD, this)
        }
        const playCardFallback = () => {
          this._cardContainer.setPosition(
            this._cardContainer.getData('position').container.x,
            this._cardContainer.getData('position').container.y
          )
          this.$removeCancel()
          this.$stateMachine.setState(STATES.PLAYER_TURN)
        }
        const cleanInteractions = () => {
          this._cardContainer.setData('draggingFromHand', false).setDepth(0)
          this._scene.input.removeListener('pointermove')
          this._previewContainer.destroy()
        }

        if (this.$stateMachine.currentStateName === STATES.PLAYER_TURN && this.$playable) {
          if (!this._cardContainer.getData('draggingFromHand')) {
            // Dragging is false
            this._cardContainer.setData('draggingFromHand', true).setDepth(1)
            this._cardContainer.setData('position', {
              container: {
                x: this._cardContainer.x,
                y: this._cardContainer.y,
              },
              pointer: {
                x: pointer.x,
                y: pointer.y,
              },
            })

            // Add dragging
            this._scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
              this._cardContainer.x =
                this._cardContainer.getData('position').container.x +
                (pointer.x - this._cardContainer.getData('position').pointer.x)
              this._cardContainer.y =
                this._cardContainer.getData('position').container.y +
                (pointer.y - this._cardContainer.getData('position').pointer.y)
            })
            return
          }

          // Dragging is true
          this._cardContainer.setData('draggingFromHand', false).setDepth(0)

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
          if (this._cardData.battlecry) {
            this.$addCancel()
            this.$stateMachine.setState(STATES.PLAYER_BATTLECRY, {
              source: this,
              callback: playCardCallback,
              fallback: playCardFallback,
            })

            cleanInteractions()
            return
          }

          playCardCallback()
          cleanInteractions()
          return
        }

        // Cancel battlecry target clicked has cancel button
        if (this.$stateMachine.currentStateName === STATES.PLAYER_BATTLECRY_CHOOSE_TARGET) {
          if (this.$cancelButton) {
            playCardFallback()
            this.$stateMachine.setState(STATES.PLAYER_TURN)
          }

          return
        }

        // Exhausted
        warningMessage(this._scene, WARNING_KEYS.CANT_PLAY)
      })

      return
    }
  }

  /**
   * Set playable to false
   */
  private $handCard(): void {
    this.$playable = false
  }

  /**
   * If battlecry choose target then set target chosen
   * 
   * If battle choose target and cancel exists then remove cancel and set player turn, if no cancel then set target chosen
   * 
   * If player turn and can attack then set player choose target
   */
  private $addClickBoard(): void {
    this._cardTemplateImage.on('pointerup', () => {
      if (this.$stateMachine.currentStateName === STATES.PLAYER_BATTLECRY_CHOOSE_TARGET) {
        this.$stateMachine.setState(STATES.PLAYER_BATTLECRY_TARGET_CHOSEN, this)
        return
      }

      if (this.$stateMachine.currentStateName === STATES.PLAYER_BATTLE_CHOOSE_TARGET) {
        if (this.$cancelButton) {
          this.$removeCancel()
          this.$stateMachine.setState(STATES.PLAYER_TURN)
          return
        }

        this.$stateMachine.setState(STATES.PLAYER_BATTLE_TARGET_CHOSEN, this)
        return
      }

      if (
        this.$stateMachine.currentStateName === STATES.PLAYER_TURN &&
        this.$owner === TARGET_KEYS.PLAYER &&
        this.canAttack
      ) {
        this.$addCancel() // add cancel before state, to make remove cancel work as callback
        this.$stateMachine.setState(STATES.PLAYER_BATTLE_CHOOSE_TARGET, {
          attacker: this,
          cancelButton: this.$cancelButton,
        })
        return
      }

      // Exhausted
      warningMessage(this._scene, WARNING_KEYS.CANT_BE_SELECTED)
    })
  }

  /**
   * {@link setAttacked()} to false and {@link setSick} to true as default
   */
  private $boardCard(): void {
    this.setAttacked(false)
    this.setSick(true)
  }

  /**
   * Add a cancel button to cancel action
   */
  private $addCancel(): void {
    this.$cancelButton = this._scene.add
      .image(this._cardTemplateImage.width / 2, this._cardTemplateImage.height / 2, UI_ASSET_KEYS.CANCEL)
      .setScale(0.8)
      .setAlpha(1)
      .setOrigin(0.5)

    this._cardContainer.add(this.$cancelButton)
  }

  /**
   * Remove cancel button
   */
  private $removeCancel(): void {
    if (this.$cancelButton) {
      this.$cancelButton.destroy()
    }
  }

  /**
   * Create and return sickness zzz animation
   */
  private $sickAnimation(): Phaser.GameObjects.Particles.ParticleEmitter {
    return this._scene.add.particles(
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
