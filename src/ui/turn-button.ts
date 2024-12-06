import Phaser from 'phaser'
import { StateMachine } from '../utils/state-machine'
import { BattleScene } from '../scenes/battle-scene'
import { BATTLE_STATES } from '../utils/keys'

const BUTTON_CONFIGS = Object.freeze({
  x: 1650,
  y: 470,
  width: 200,
  height: 100,
})

export class TurnButton {
  private scene: BattleScene
  private button: Phaser.GameObjects.Rectangle

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
      this.changeTurn()
    })
  }

  public changeTurn(): void {
    if (this.scene.stateMachine.currentStateName === BATTLE_STATES.PLAYER_TURN) {
      this.scene.stateMachine.setState(BATTLE_STATES.OPPONENT_TURN_START)
      return
    }

    if (this.scene.stateMachine.currentStateName === BATTLE_STATES.OPPONENT_TURN) {
      this.scene.stateMachine.setState(BATTLE_STATES.PLAYER_TURN_START)
      return
    }
  }
}
