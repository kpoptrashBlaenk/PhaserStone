import { Board } from '../objects/board'
import { Card } from '../objects/card'
import { Hand } from '../objects/hand'
import { STATES } from '../utils/keys'
import { StateMachine } from '../utils/state-machine'

export class EnemyAI {
  private $scene: Phaser.Scene
  private $stateMachine: StateMachine
  private $hand: Hand
  private $board: {
    PLAYER: Board
    ENEMY: Board
  }

  constructor(
    scene: Phaser.Scene,
    stateMachine: StateMachine,
    hand: Hand,
    board: {
      PLAYER: Board
      ENEMY: Board
    }
  ) {
    this.$scene = scene
    this.$stateMachine = stateMachine
    this.$hand = hand
    this.$board = board
  }

  /**
   * Public Opponent Turn Handler
   */
  public opponentTurn(): void {
    this.$playHand()
  }

  /**
   * Play cards from hand if none, go to board
   */
  private $playHand(): void {
    let playableHand: Card[] = []
    const hand = this.$hand.cards

    // Get all playable cards
    hand.forEach((card: Card) => {
      if (card.isPlayable) {
        playableHand.push(card)
      }
    })

    // If playable cards, play, if not attack (board)
    if (playableHand.length > 0) {
      const card = playableHand[Math.floor(Math.random() * playableHand.length)]
      this.$stateMachine.setState(STATES.ENEMY_PLAY_CARD, card)
      return
    }

    this.$playBoard()
    this.$stateMachine.setState(STATES.TURN_BUTTON)
  }

  private $playBoard(): void {}
}
