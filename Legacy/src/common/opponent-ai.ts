import { Board } from '../gameObjects/board'
import { BoardCard } from '../gameObjects/card/board-card'
import { HandCard } from '../gameObjects/card/hand-card'
import { Hand } from '../gameObjects/hand'
import { Hero } from '../gameObjects/hero'
import { Mana } from '../gameObjects/mana'
import { BattleScene } from '../scenes/battle-scene'
import { BATTLE_STATES } from '../../../src/utils/keys'

export class OpponentAI {
  private scene: BattleScene
  private hand: Hand
  private hero: Hero
  private board: {
    PLAYER: Board
    OPPONENT: Board
  }

  constructor(
    scene: BattleScene,
    hand: Hand,
    board: {
      PLAYER: Board
      OPPONENT: Board
    },
    hero: Hero
  ) {
    this.scene = scene
    this.hand = hand
    this.board = board
    this.hero = hero
  }

  /**
   * Public Opponent Turn Handler
   */
  public opponentTurn(): void {
    this.playHand()
  }

  /**
   * Check for playable cards and play then switch to board
   */
  private playHand(): void {
    let playableHand: HandCard[] = []
    const hand = this.hand.handCards

    // Get all playable cards
    hand.forEach((card: HandCard) => {
      if (card.checkPlayable()) {
        playableHand.push(card)
      }
    })

    // If playable cards, play, if not attack (board)
    if (playableHand.length > 0) {
      const card = playableHand[Math.floor(Math.random() * playableHand.length)]
      this.scene.stateMachine.setState(BATTLE_STATES.OPPONENT_PLAY_CARD, card)
      return
    }

    this.playBoard()
  }

  /**
   * Check for attacking and attackable cards and battle then end turn
   */
  private playBoard(): void {
    const opponentBoard = this.board.OPPONENT.boardCards
    const playerBoard = this.board.PLAYER.boardCards
    const notSickMinions: BoardCard[] = []

    // Get all playable cards
    opponentBoard.forEach((card: BoardCard) => {
      if (!card.isSummoningSick && !card.isAlreadyAttacked) {
        notSickMinions.push(card)
      }
    })

    // If fighting cards and fightable cards, battle, if not change turn
    if (notSickMinions.length > 0) {
      const attacker = notSickMinions[Math.floor(Math.random() * notSickMinions.length)]
      this.scene.stateMachine.setState(BATTLE_STATES.ATTACKER_MINION_CHOSEN, attacker)

      // Attack minions, if not go face
      if (playerBoard.length > 0) {
        const defender = playerBoard[Math.floor(Math.random() * playerBoard.length)]
        this.scene.stateMachine.setState(BATTLE_STATES.DEFENDER_MINION_CHOSEN, defender)
        return
      }

      const defender = this.hero
      this.scene.stateMachine.setState(BATTLE_STATES.DEFENDER_MINION_CHOSEN, defender)
      return
    }

    this.scene.stateMachine.setState(BATTLE_STATES.OPPONENT_TURN_END)
  }
}