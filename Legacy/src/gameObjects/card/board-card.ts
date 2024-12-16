import { EFFECT_ASSET_KEYS } from '../../../../src/assets/asset-keys'
import { setOutline } from '../../common/outline'
import { BattleScene } from '../../scenes/battle-scene'
import { BATTLE_STATES, TARGET_KEYS, TargetKeys, WARNING_KEYS } from '../../../../src/utils/keys'
import { CARD_SCALE, SUMMONING_SICK_CONFIGS, ZZZ_ANIMATION_POSITION } from '../../utils/visual-configs'
import { Card } from './card'
import { CardData } from './card-keys'

export class BoardCard extends Card {
  private alreadyAttacked: boolean
  private summoningSick: boolean
  private summoningSickParticles: Phaser.GameObjects.Particles.ParticleEmitter | null = null
  private cancelImage: Phaser.GameObjects.Image | undefined

  constructor(scene: BattleScene, card: CardData, owner: TargetKeys) {
    super(scene, card, owner)
    this.boardSize()

    this.cardTemplate.setInteractive({
      cursor: 'pointer',
    })
    this.addHover()

    if (this.owner === TARGET_KEYS.PLAYER) {
      this.forPlayer()
    } else {
      this.forOpponent()
    }

    this.addClick()

    this.setSummoningSick = true
    this.setAlreadyAttacked = false
  }

  /**
   * Get if minion has is summoning sick
   */
  public get isSummoningSick(): boolean {
    return this.summoningSick
  }

  /**
   * Get if minion already attacked
   */
  public get isAlreadyAttacked(): boolean {
    return this.alreadyAttacked
  }

  /**
   * Sets if minion has is summoning sick
   */
  public set setSummoningSick(value: boolean) {
    this.summoningSick = value
    this.summoningSickAnimation()
  }

  /**
   * Sets if minion already attacked
   */
  public set setAlreadyAttacked(attacked: boolean) {
    this.alreadyAttacked = attacked

    if (attacked) {
      this.removeOutline()
    }
  }

  /**
   * Checks if minion is not summoning sick and has not already attacked, then draw outlines
   */
  public checkCanAttack(): void {
    const canAttack = !this.summoningSick && !this.alreadyAttacked
    setOutline(this.scene, canAttack, this.cardTemplate)
  }

  /**
   * Remove Outline
   */
  public removeOutline(): void {
    setOutline(this.scene, false, this.cardTemplate)
  }

  /**
   * Remove cancel image when selection cancelled or fulfilled
   */
  public removeCancel(): void {
    this.cancelImage?.setAlpha(0)
  }

  /**
   * Add Click
   */
  private forPlayer(): void {
    // Add cancel image for cancelling selection
    this.cancelImage = this.scene.battleManager.addCancelImage(
      this.cardContainer.width / 2 / this.cardContainer.scale,
      this.cardContainer.height / 2 / this.cardContainer.scale,
      0.8
    )
    this.cardContainer.add(this.cancelImage)

    this.cardTemplate.on('pointerup', () => {
      // If player turn, check if not sick and not attacked, choose this to attack
      if (this.scene.stateMachine.currentStateName === BATTLE_STATES.PLAYER_TURN) {
        if (this.summoningSick) {
          this.scene.warnMessage.showTurnMessage(WARNING_KEYS.SUMMONING_SICK)
          return
        }
        if (this.alreadyAttacked) {
          this.scene.warnMessage.showTurnMessage(WARNING_KEYS.ALREADY_ATTACKED)
          return
        }

        this.scene.stateMachine.setState(BATTLE_STATES.ATTACKER_MINION_CHOSEN, this)
        this.cancelImage?.setAlpha(1)
        return
      }

      // If choose enemy and this selected, cancel
      if (this.scene.stateMachine.currentStateName === BATTLE_STATES.ATTACKER_MINION_CHOSEN) {
        this.scene.stateMachine.setState(BATTLE_STATES.PLAYER_TURN, this)
        this.removeCancel()
      }
    })
  }

  /**
   * Add Click
   */
  private forOpponent(): void {
    this.cardTemplate.on('pointerup', () => {
      if (this.scene.stateMachine.currentStateName === BATTLE_STATES.ATTACKER_MINION_CHOSEN) {
        this.scene.stateMachine.setState(BATTLE_STATES.DEFENDER_MINION_CHOSEN, this)
      }
    })
  }

  private addClick(): void {
    this.cardTemplate.on('pointerup', () => {
      if (this.scene.stateMachine.currentStateName === BATTLE_STATES.PLAYER_CHOOSE_TARGET) {
        this.scene.stateMachine.setState(BATTLE_STATES.PLAYER_TARGET_CHOSEN, this)
      }
    })
  }

  /**
   * Add PreviewUI to hover and hide it on unhover
   */
  private addHover(): void {
    this.cardTemplate.on('pointerover', () => {
      this.scene.playerPreview.modifyPreviewCardObjects(this.card, this.originalCard)
    })

    this.cardTemplate.on('pointerout', () => {
      this.scene.playerPreview.hideCard()
    })
  }

  /**
   * Resize Card to fit in hand
   */
  private boardSize(): void {
    this.cardContainer.setScale(CARD_SCALE)
    this.cardContainer.setSize(
      this.cardContainer.width * this.cardContainer.scaleX,
      this.cardContainer.height * this.cardContainer.scaleY
    )
    this.handleImage()
  }

  /**
   * Play or destroy zzz animation depending on summoningSick
   */
  private summoningSickAnimation(): void {
    if (this.summoningSick) {
      this.summoningSickParticles = this.scene.add.particles(
        ZZZ_ANIMATION_POSITION.x,
        ZZZ_ANIMATION_POSITION.y,
        EFFECT_ASSET_KEYS.Z,
        {
          scale: { start: SUMMONING_SICK_CONFIGS.SCALE.START, end: SUMMONING_SICK_CONFIGS.SCALE.END },
          speed: SUMMONING_SICK_CONFIGS.SPEED,
          lifespan: SUMMONING_SICK_CONFIGS.LIFESPAN,
          frequency: SUMMONING_SICK_CONFIGS.FREQUENCY,
          angle: { min: SUMMONING_SICK_CONFIGS.ANGLE.MIN, max: SUMMONING_SICK_CONFIGS.ANGLE.MAX },
          gravityY: SUMMONING_SICK_CONFIGS.GRAVITY_Y,
          accelerationX: SUMMONING_SICK_CONFIGS.ACCELERATION_X,
          accelerationY: SUMMONING_SICK_CONFIGS.ACCELERATION_Y,
        }
      )

      this.cardContainer.add(this.summoningSickParticles)
      return
    }

    this.summoningSickParticles?.destroy()
    this.summoningSickParticles = null
  }
}
