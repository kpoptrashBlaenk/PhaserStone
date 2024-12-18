import { STATES, TARGET_KEYS, TargetKeys } from '../utils/keys'
import { BUTTON_CONFIG } from '../utils/visual-configs'
import { StateMachine } from '../utils/state-machine'
import { FONT_KEYS } from '../assets/font-keys'

export class TurnButton {
  private $scene: Phaser.Scene
  private $stateMachine: StateMachine
  private $button: Phaser.GameObjects.Rectangle
  private $turnMessage: Phaser.GameObjects.Text
  private $currentTurn: TargetKeys

  constructor(scene: Phaser.Scene, stateMachine: StateMachine) {
    this.$scene = scene
    this.$stateMachine = stateMachine

    this.$createTurnMessage()
    this.$createTurnButton()
  }

  /**
   * Change turn depending on player
   */
  public changeTurn(): void {
    if (this.$currentTurn === TARGET_KEYS.PLAYER) {
      this.$currentTurn = TARGET_KEYS.ENEMY
      this.$stateMachine.setState(STATES.ENEMY_TURN_START)
      return
    }

    if (this.$currentTurn === TARGET_KEYS.ENEMY) {
      this.$showTurnMessage()
      this.$currentTurn = TARGET_KEYS.PLAYER
      this.$stateMachine.setState(STATES.PLAYER_TURN_START)
      return
    }

    // Default
    this.$showTurnMessage()
    this.$currentTurn = TARGET_KEYS.PLAYER
    this.$stateMachine.setState(STATES.PLAYER_TURN_START)
  }

  /**
   * Create turn button
   */
  private $createTurnButton(): void {
    this.$button = this.$scene.add.rectangle(
      BUTTON_CONFIG.X,
      BUTTON_CONFIG.Y,
      BUTTON_CONFIG.WIDTH,
      BUTTON_CONFIG.HEIGHT,
      0xff0000
    )

    this.$button.setInteractive({
      cursor: 'pointer',
    })

    this.$button.on('pointerup', () => {
      if (this.$stateMachine.currentStateName === STATES.PLAYER_TURN) {
        this.$stateMachine.setState(
          this.$currentTurn === TARGET_KEYS.PLAYER ? STATES.PLAYER_TURN_END : STATES.ENEMY_TURN_END
        )
      }
    })
  }

  /**
   * Create Your Turn Message
   */
  private $createTurnMessage(): void {
    this.$turnMessage = this.$scene.add
      .text(this.$scene.scale.width / 2, this.$scene.scale.height / 2, 'Your Turn', {
        fontFamily: FONT_KEYS.HEARTHSTONE,
        fontSize: '64px',
        color: '#FFD700',
        stroke: '#000000',
        strokeThickness: 6,
        align: 'center',
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: '#000000',
          blur: 5,
          fill: true,
        },
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(10)
  }

  /**
   * Show Your Turn Message, happens only when players turn
   */
  private $showTurnMessage(): void {
    this.$scene.tweens.add({
      targets: this.$turnMessage,
      alpha: { from: 0, to: 1 },
      scale: { from: 0.5, to: 1 },
      ease: 'Back.Out',
      duration: 800,
      onComplete: () => {
        this.$scene.tweens.add({
          targets: this.$turnMessage,
          alpha: 0,
          duration: 600,
          delay: 1000,
        })
      },
    })
  }
}