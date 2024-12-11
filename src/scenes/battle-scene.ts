import { CARD_ASSETS_KEYS, DATA_ASSET_KEYS } from '../assets/asset-keys'
import { Background } from '../ui/board-background'
import { CLASS_KEYS, TYPE_KEYS } from '../gameObjects/card/card-keys'
import { Preview } from '../gameObjects/card/preview-card'
import { Deck } from '../gameObjects/deck'
import { Hand } from '../gameObjects/hand'
import {
  BATTLE_STATES,
  BATTLE_TARGET_KEYS,
  BattleTargetKeys,
  TARGET_KEYS,
  TargetKeys,
  WARNING_KEYS,
} from '../utils/keys'
import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'
import { Board } from '../gameObjects/board'
import { HandCard } from '../gameObjects/card/hand-card'
import { StateMachine } from '../utils/state-machine'
import { BoardCard } from '../gameObjects/card/board-card'
import { TurnButton } from '../ui/turn-button'
import { WarnMessage } from '../ui/warn-message'
import { Mana } from '../gameObjects/mana'
import { Hero } from '../gameObjects/hero'
import { FONT_KEYS } from '../assets/font-keys'

export class BattleScene extends BaseScene {
  public stateMachine: StateMachine
  public playerPreview: Preview
  public warnMessage: WarnMessage
  private opponentPreview: Preview
  private turnButton: TurnButton

  private deck: {
    PLAYER: Deck
    OPPONENT: Deck
  } = { PLAYER: null as any, OPPONENT: null as any }
  private hand: {
    PLAYER: Hand
    OPPONENT: Hand
  } = { PLAYER: null as any, OPPONENT: null as any }
  private board: {
    PLAYER: Board
    OPPONENT: Board
  } = { PLAYER: null as any, OPPONENT: null as any }
  private mana: {
    PLAYER: Mana
    OPPONENT: Mana
  } = { PLAYER: null as any, OPPONENT: null as any }
  private hero: {
    PLAYER: Hero
    OPPONENT: Hero
  } = { PLAYER: null as any, OPPONENT: null as any }

  constructor() {
    super({
      key: SCENE_KEYS.BATTLE_SCENE,
    })

    this.chosenBattleMinions[BATTLE_TARGET_KEYS.ATTACKER] = undefined
    this.chosenBattleMinions[BATTLE_TARGET_KEYS.DEFENDER] = undefined
  }

  create(): void {
    super.create()

    this.setupBackground()
    this.setupTurnButton()
    this.setupWarnMessage()
    this.setupDecksAndHands()
    this.setupPreviews()
    this.setupBoards()
    this.setupMana()
    this.setupHeroes()
    this.setupStateMachine()

    // Game Start
    this.drawCard(TARGET_KEYS.OPPONENT)
    this.drawCard(TARGET_KEYS.OPPONENT)
    this.drawCard(TARGET_KEYS.OPPONENT)
    this.drawCard(TARGET_KEYS.OPPONENT)
    this.drawCard(TARGET_KEYS.OPPONENT)
    this.drawCard(TARGET_KEYS.PLAYER)
    this.drawCard(TARGET_KEYS.PLAYER)
    this.drawCard(TARGET_KEYS.PLAYER)
    this.drawCard(TARGET_KEYS.PLAYER)
    this.turnButton.changeTurn()
  }

  update(): void {
    super.update()

    this.stateMachine.update()
  }

  /**
   * Sets up background
   */
  private setupBackground(): void {
    new Background(this)
  }

  /**
   * Sets up turn button
   */
  private setupTurnButton(): void {
    this.turnButton = new TurnButton(this)
  }

  /**
   * Sets up warn message
   */
  private setupWarnMessage(): void {
    this.warnMessage = new WarnMessage(this)
  }

  /**
   * Sets up decks and hands
   */
  private setupDecksAndHands(): void {
    this.deck.PLAYER = new Deck(this, this.cache.json.get(DATA_ASSET_KEYS.CARDS), TARGET_KEYS.PLAYER)
    this.deck.OPPONENT = new Deck(this, this.cache.json.get(DATA_ASSET_KEYS.CARDS), TARGET_KEYS.OPPONENT)

    this.hand.PLAYER = new Hand(this, TARGET_KEYS.PLAYER)
    this.hand.OPPONENT = new Hand(this, TARGET_KEYS.OPPONENT)
  }

  /**
   * Sets up previews
   */
  private setupPreviews(): void {
    const previewTemplate = {
      assetKey: CARD_ASSETS_KEYS.TEMPLATE,
      attack: 4,
      cardClass: CLASS_KEYS.NEUTRAL,
      cost: 0,
      health: 9,
      id: 0,
      name: 'Preview',
      type: TYPE_KEYS.MINION,
    }
    this.playerPreview = new Preview(this, previewTemplate, TARGET_KEYS.PLAYER)
    this.opponentPreview = new Preview(this, previewTemplate, TARGET_KEYS.OPPONENT)
  }

  /**
   * Sets up boards
   */
  private setupBoards(): void {
    this.board.PLAYER = new Board(this, TARGET_KEYS.PLAYER)
    this.board.OPPONENT = new Board(this, TARGET_KEYS.OPPONENT)
  }

  /**
   * Sets up mana
   */
  private setupMana(): void {
    this.mana.PLAYER = new Mana(this, TARGET_KEYS.PLAYER)
    this.mana.OPPONENT = new Mana(this, TARGET_KEYS.OPPONENT)
  }

  /**
   * Sets up heroes
   */
  private setupHeroes(): void {
    this.hero.PLAYER = new Hero(this, TARGET_KEYS.PLAYER)
    this.hero.OPPONENT = new Hero(this, TARGET_KEYS.OPPONENT)
  }

  /**
   * Sets up state machine
   */
  private setupStateMachine(): void {
    this.createStateMachine()
  }

  /**
   * Target draws card
   */
  private drawCard(target: TargetKeys, callback?: () => void): void {
    this.deck[target].drawCard((card) => {
      this.hand[target].drawCard(card, () => {
        callback?.()
      })
    })
  }

  /**
   * Target plays card
   */
  private playCard(target: TargetKeys, card: HandCard, callback?: () => void): void {
    this.hand[target].playCard(card, () => {
      this.board[target].playCard(card)
      callback?.()
    })
  }

  /**
   * Checks what cards are playable
   */
  private checkPlayable(): void {
    this.hand.PLAYER.handCards.forEach((card) => {
      card.checkPlayable(this.mana.PLAYER.getCurrentMana)
    })
  }

  /**
   * Checks what cards are playable
   */
  private checkCanAttack(): void {
    this.board.PLAYER.boardCards.forEach((card) => {
      card.checkCanAttack()
    })

    this.hero.PLAYER.checkCanAttack()
    this.hero.OPPONENT.checkCanAttack()
  }

  /**
   * Remove all green borders, because opponent turn
   */
  private removeGreenBorders(): void {
    this.hand.PLAYER.handCards.forEach((card) => {
      card.removeBorder()
    })

    this.board.PLAYER.boardCards.forEach((card) => {
      card.removeBorder()
    })
  }

  /**
   * Track and set attacker and defender minions
   */
  private chosenBattleMinions: Record<BattleTargetKeys, BoardCard | Hero | undefined> = {
    ATTACKER: undefined,
    DEFENDER: undefined,
  }

  /**
   * Reset Summoning Sickness and Minions who attacked
   */
  private resetMinionsAttackState(board: Board): void {
    board.boardCards.forEach((card) => {
      card.setSummoningSick = false
      card.setAlreadyAttacked = false
    })
    this.hero.PLAYER.alreadyAttacked = false
    this.hero.OPPONENT.alreadyAttacked = false
  }

  /**
   * Show message with game winner
   */
  private endGameMessage(message: string, color: string): void {
    const screenCenterX = this.scale.width / 2
    const screenCenterY = this.scale.height / 2

    const textStyle = {
      fontFamily: FONT_KEYS.HEARTHSTONE,
      fontSize: '80px',
      color: color,
      stroke: '#000000',
      strokeThickness: 8,
      align: 'center',
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: '#000000',
        blur: 6,
        fill: true,
      },
    }

    const messageText = this.add
      .text(screenCenterX, screenCenterY, message, textStyle)
      .setOrigin(0.5)
      .setAlpha(0)

    this.tweens.add({
      targets: messageText,
      alpha: { from: 0, to: 1 },
      scale: { from: 0.5, to: 1 },
      ease: 'Back.Out',
      duration: 800,
      onComplete: () => {
        this.time.delayedCall(2000, () => {
          this.tweens.add({
            targets: messageText,
            alpha: 0,
            scale: 0.5,
            ease: 'Back.In',
            duration: 800,
            onComplete: () => {
              messageText.destroy()
              location.reload()
            },
          })
        })
      },
    })
  }

  /**
   * Create the state machine
   */
  private createStateMachine(): void {
    this.stateMachine = new StateMachine('battle', this)

    // Game Flow States
    this.stateMachine.addState({
      name: BATTLE_STATES.PLAYER_TURN_START,
      onEnter: () => {
        this.mana.PLAYER.addManaCrystal()
        this.mana.PLAYER.refreshMana()
        this.resetMinionsAttackState(this.board.OPPONENT)
        this.stateMachine.setState(BATTLE_STATES.PLAYER_DRAW_CARD)
      },
    })

    this.stateMachine.addState({
      name: BATTLE_STATES.OPPONENT_TURN_START,
      onEnter: () => {
        this.removeGreenBorders()
        this.mana.OPPONENT.addManaCrystal()
        this.mana.OPPONENT.refreshMana()
        this.resetMinionsAttackState(this.board.PLAYER)
        this.stateMachine.setState(BATTLE_STATES.OPPONENT_DRAW_CARD)
      },
    })

    this.stateMachine.addState({
      name: BATTLE_STATES.PLAYER_TURN_END,
      onEnter: () => {
        this.turnButton.changeTurn()
      },
    })

    this.stateMachine.addState({
      name: BATTLE_STATES.OPPONENT_TURN_END,
      onEnter: () => {
        this.turnButton.changeTurn()
      },
    })

    this.stateMachine.addState({
      name: BATTLE_STATES.GAME_END,
      onEnter: (loser: TargetKeys) => {
        loser === TARGET_KEYS.PLAYER
          ? this.endGameMessage('Defeat!', '#ff0000')
          : this.endGameMessage('Victory!', '#00ff00')
      },
    })

    // Player-Specific States
    this.stateMachine.addState({
      name: BATTLE_STATES.PLAYER_DRAW_CARD,
      onEnter: () =>
        this.drawCard(TARGET_KEYS.PLAYER, () => {
          this.checkPlayable()
          this.stateMachine.setState(BATTLE_STATES.PLAYER_TURN)
        }),
    })

    this.stateMachine.addState({
      name: BATTLE_STATES.PLAYER_TURN,
      onEnter: () => {
        this.checkPlayable()
        this.checkCanAttack()
      },
    })

    this.stateMachine.addState({
      name: BATTLE_STATES.PLAYER_PLAY_CARD,
      onEnter: (card: HandCard) => {
        this.mana.PLAYER.useMana(card.cardData.cost)
        this.checkPlayable()
        this.checkCanAttack()
        this.playCard(TARGET_KEYS.PLAYER, card, () => {
          this.stateMachine.setState(BATTLE_STATES.PLAYER_TURN)
        })
      },
    })

    // Opponent-Specific States
    this.stateMachine.addState({
      name: BATTLE_STATES.OPPONENT_DRAW_CARD,
      onEnter: () =>
        this.drawCard(TARGET_KEYS.OPPONENT, () => {
          this.stateMachine.setState(BATTLE_STATES.OPPONENT_TURN)
        }),
    })

    this.stateMachine.addState({
      name: BATTLE_STATES.OPPONENT_TURN,
      onEnter: () => {
        // Play cards AI
        const hand = this.hand.OPPONENT.handCards
        let playableHand: HandCard[] = []

        // Get all playable cards
        hand.forEach((card: HandCard) => {
          if (card.cardData.cost <= this.mana.OPPONENT.getCurrentMana) {
            playableHand.push(card)
          }
        })

        // If playable cards, play, if not attack
        if (playableHand.length > 0) {
          const card = playableHand[Math.floor(Math.random() * playableHand.length)]
          this.stateMachine.setState(BATTLE_STATES.OPPONENT_PLAY_CARD, card)
        } else {
          // Opponent Attack AI
          const opponentBoard = this.board.OPPONENT.boardCards
          const playerBoard = this.board.PLAYER.boardCards
          const notSickMinions: BoardCard[] = []

          // Get all playable cards
          opponentBoard.forEach((card: BoardCard) => {
            if (!card.isSummoningSick && !card.isAlreadyAttacked) {
              notSickMinions.push(card)
            }
          })

          // If fighting cards and fightable cards, play, if not change turn
          if (notSickMinions.length > 0 && playerBoard.length > 0) {
            this.chosenBattleMinions.ATTACKER =
              notSickMinions[Math.floor(Math.random() * notSickMinions.length)]
            this.chosenBattleMinions.DEFENDER = playerBoard[Math.floor(Math.random() * playerBoard.length)]
            this.stateMachine.setState(BATTLE_STATES.MINION_BATTLE)
          } else {
            this.stateMachine.setState(BATTLE_STATES.OPPONENT_TURN_END)
          }
        }
      },
    })

    this.stateMachine.addState({
      name: BATTLE_STATES.OPPONENT_PLAY_CARD,
      onEnter: (card: HandCard) => {
        this.playCard(TARGET_KEYS.OPPONENT, card)
        // Preview
        setTimeout(() => {
          this.mana.OPPONENT.useMana(card.cardData.cost)
          this.opponentPreview.modifyPreviewCardObjects(card.cardData, card.cardData)
          // Delay after preview to resume turn
          setTimeout(() => {
            this.opponentPreview.hideCard()
            this.stateMachine.setState(BATTLE_STATES.OPPONENT_TURN)
          }, 1500)
        }, 250)
      },
    })

    // Battle States
    this.stateMachine.addState({
      name: BATTLE_STATES.ATTACKER_MINION_CHOSEN,
      onEnter: (attackerMinion: BoardCard | Hero) => {
        this.chosenBattleMinions[BATTLE_TARGET_KEYS.ATTACKER] = attackerMinion
      },
    })

    this.stateMachine.addState({
      name: BATTLE_STATES.DEFENDER_MINION_CHOSEN,
      onEnter: (defenderMinion: BoardCard | Hero) => {
        this.chosenBattleMinions[BATTLE_TARGET_KEYS.DEFENDER] = defenderMinion
        this.stateMachine.setState(BATTLE_STATES.MINION_BATTLE)
      },
    })

    this.stateMachine.addState({
      name: BATTLE_STATES.MINION_BATTLE,
      onEnter: () => {
        const attacker = this.chosenBattleMinions.ATTACKER
        const defender = this.chosenBattleMinions.DEFENDER

        if (attacker && defender) {
          // Remove cancel if player selected this
          if (attacker.player === TARGET_KEYS.PLAYER) {
            attacker.removeCancel()
          }

          this.board[attacker.player].depth = 1
          attacker?.attack(defender, () => {
            this.board[attacker.player].depth = 0
            this.stateMachine.setState(BATTLE_STATES.AFTER_BATTLE_CHECK)
          })
        }
      },
    })

    this.stateMachine.addState({
      name: BATTLE_STATES.AFTER_BATTLE_CHECK,
      onEnter: () => {
        // Set turn state
        const setState = () => {
          if (this.turnButton.getCurrentTurn === TARGET_KEYS.PLAYER) {
            this.stateMachine.setState(BATTLE_STATES.PLAYER_TURN)
          } else {
            this.stateMachine.setState(BATTLE_STATES.OPPONENT_TURN)
          }
        }

        const attacker = this.chosenBattleMinions.ATTACKER
        const defender = this.chosenBattleMinions.DEFENDER

        if (attacker && defender) {
          const attackerHealth =
            attacker instanceof BoardCard ? attacker.cardData.health : attacker.currentHealth
          const defenderHealth =
            defender instanceof BoardCard ? defender.cardData.health : defender.currentHealth
          const deadMinions = []

          // Check if attacker died
          if (attackerHealth <= 0) {
            deadMinions.push(attacker)
          }

          // Check if defender died
          if (defenderHealth <= 0) {
            deadMinions.push(defender)
          }

          if (deadMinions.length > 0) {
            deadMinions.forEach((card) => {
              card.death(() => {
                if (card instanceof BoardCard) {
                  this.board[card.player].cardDies(card, () => {
                    setState()
                  })
                  return
                }

                if (card instanceof Hero) {
                  this.stateMachine.setState(BATTLE_STATES.GAME_END, card.player)
                  return
                }
              })
            })
          } else {
            // If no minions died, set states immediately
            setState()
          }
        }
      },
    })
  }
}
