import { FONT_KEYS } from '../assets/font-keys'
import { STATES, TARGET_KEYS, TargetKeys } from '../utils/keys'
import { StateMachine } from '../utils/state-machine'
import { BUTTON_CONFIG } from '../utils/visual-configs'

/**
 * The TurnButton class handles all turn related actions
 */
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
   * Change turn depending on current turn and {@link $createTurnMessage()} (default is player's turn)
   */
  public changeTurn(): void {
    if (this.$currentTurn === TARGET_KEYS.PLAYER) {
      this.$stateMachine.setState(STATES.PLAYER_TURN_END)
      this.$currentTurn = TARGET_KEYS.ENEMY
      return
    }

    if (this.$currentTurn === TARGET_KEYS.ENEMY) {
      this.$showTurnMessage()
      this.$stateMachine.setState(STATES.ENEMY_TURN_END)
      this.$currentTurn = TARGET_KEYS.PLAYER
      return
    }

    // Default
    this.$showTurnMessage()
    this.$currentTurn = TARGET_KEYS.PLAYER
    this.$stateMachine.setState(STATES.PLAYER_TURN_START)
  }

  /**
   * Create turn button and set it interactive to set turn states
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
      if (
        this.$stateMachine.currentStateName === STATES.PLAYER_TURN ||
        this.$stateMachine.currentStateName === STATES.ENEMY_TURN
      ) {
        this.$stateMachine.setState(STATES.TURN_BUTTON)
      }
    })
  }

  /**
   * Create turn message but hide it
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
   * Show turn message and animate it to then hide it
   */
  private $showTurnMessage(): void {
    // Show message
    this.$scene.tweens.add({
      targets: this.$turnMessage,
      alpha: { from: 0, to: 1 },
      scale: { from: 0.5, to: 1 },
      ease: 'Back.Out',
      duration: 800,
      // Hide message
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
