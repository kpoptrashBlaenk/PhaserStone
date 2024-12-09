import Phaser from 'phaser'
import { BattleScene } from '../scenes/battle-scene'
import { BATTLE_STATES, TARGET_KEYS, TargetKeys } from '../utils/keys'
import { FONT_KEYS } from '../assets/font-keys'

const BUTTON_CONFIGS = Object.freeze({
  x: 1650,
  y: 470,
  width: 200,
  height: 100,
})

export class TurnButton {
  private scene: BattleScene
  private button: Phaser.GameObjects.Rectangle
  private turnMessage: Phaser.GameObjects.Text
  private currentTurn: TargetKeys

  constructor(scene: BattleScene) {
    this.scene = scene

    this.button = this.scene.add.rectangle(
      BUTTON_CONFIGS.x,
      BUTTON_CONFIGS.y,
      BUTTON_CONFIGS.width,
      BUTTON_CONFIGS.height,
      0xff0000
    )

    this.button.setInteractive({
      cursor: 'pointer',
    })

    this.button.on('pointerup', () => {
      if (this.scene.stateMachine.currentStateName === BATTLE_STATES.PLAYER_TURN) {
        this.scene.stateMachine.setState(
          this.currentTurn === TARGET_KEYS.PLAYER
            ? BATTLE_STATES.PLAYER_TURN_END
            : BATTLE_STATES.OPPONENT_TURN_END
        )
      }
    })

    this.turnMessage = this.createTurnMessage()
  }

  public get getCurrentTurn(): TargetKeys {
    return this.currentTurn
  }

  /**
   * Change turn depending on player
   */
  public changeTurn(): void {
    if (this.currentTurn === TARGET_KEYS.PLAYER) {
      this.currentTurn = TARGET_KEYS.OPPONENT
      this.scene.stateMachine.setState(BATTLE_STATES.OPPONENT_TURN_START)
      return
    }

    if (this.currentTurn === TARGET_KEYS.OPPONENT) {
      this.showTurnMessage()
      this.currentTurn = TARGET_KEYS.PLAYER
      this.scene.stateMachine.setState(BATTLE_STATES.PLAYER_TURN_START)
      return
    }

    // Default
    this.showTurnMessage()
    this.currentTurn = TARGET_KEYS.PLAYER
    this.scene.stateMachine.setState(BATTLE_STATES.PLAYER_TURN_START)
  }

  /**
   * Create Your Turn Message
   */
  private createTurnMessage(): Phaser.GameObjects.Text {
    return this.scene.add
      .text(this.scene.scale.width / 2, this.scene.scale.height / 2, 'Your Turn', {
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
  private showTurnMessage(): void {
    this.scene.tweens.add({
      targets: this.turnMessage,
      alpha: { from: 0, to: 1 },
      scale: { from: 0.5, to: 1 },
      ease: 'Back.Out',
      duration: 800,
      onComplete: () => {
        this.scene.tweens.add({
          targets: this.turnMessage,
          alpha: 0,
          duration: 600,
          delay: 1000,
        })
      },
    })
  }
}
