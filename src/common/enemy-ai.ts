import { Board } from '../objects/board'
import { Card } from '../objects/card'
import { Hand } from '../objects/hand'
import { Hero } from '../objects/hero'
import { STATES } from '../utils/keys'
import { StateMachine } from '../utils/state-machine'

/**
 * The EnemyAI class handles the enemy actions during its turn
 */
export class EnemyAI {
  private $stateMachine: StateMachine
  private $hand: Hand
  private $board: { PLAYER: Board; ENEMY: Board }
  private $hero: { PLAYER: Hero; ENEMY: Hero }

  constructor(
    stateMachine: StateMachine,
    hand: Hand,
    board: { PLAYER: Board; ENEMY: Board },
    hero: { PLAYER: Hero; ENEMY: Hero }
  ) {
    this.$stateMachine = stateMachine
    this.$hand = hand
    this.$board = board
    this.$hero = hero
  }

  /**
   * Call {@link $playHand}
   */
  public opponentTurn(): void {
    this.$playHand()
  }

  /**
   * Check for playable cards and play them, if none then {@link $playBoard}
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

    // If playable cards, play, if not, attack (board)
    if (playableHand.length > 0) {
      const card = playableHand[Math.floor(Math.random() * playableHand.length)]
      this.$stateMachine.setState(STATES.ENEMY_PLAY_CARD, card)
      return
    }

    this.$playBoard()
  }


  /**
   * Check for cards and heroes that can attack, if none then change turn
   */
  private $playBoard(): void {
    let attackingCards: (Card | Hero)[] = []
    const enemyBoard = [...this.$board.ENEMY.cards, this.$hero.ENEMY]
    const attackableCards = [...this.$board.PLAYER.cards, this.$hero.PLAYER]

    // Get all cards that can attack
    enemyBoard.forEach((card: Card | Hero) => {
      if (card.canAttack) {
        attackingCards.push(card)
      }
    })

    if (attackingCards.length > 0) {
      this.$stateMachine.setState(
        STATES.ENEMY_BATTLE_CHOOSE_TARGET,
        attackingCards[Math.floor(Math.random() * attackingCards.length)]
      )

      this.$stateMachine.setState(
        STATES.ENEMY_BATTLE_TARGET_CHOSEN,
        attackableCards[Math.floor(Math.random() * attackableCards.length)]
      )

      return
    }

    this.$stateMachine.setState(STATES.TURN_BUTTON)
  }
}
