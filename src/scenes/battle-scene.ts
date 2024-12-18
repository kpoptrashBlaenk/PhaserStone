import { Card } from '../objects/card'
import { Deck } from '../objects/deck'
import { Hand } from '../objects/hand'
import { Background } from '../ui/background'
import { AnimationManager } from '../utils/animation-manager'
import { TARGET_KEYS, TargetKeys } from '../utils/keys'
import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'

export class BattleScene extends BaseScene {
  private $animationManager: AnimationManager

  private $deck: { PLAYER: Deck; ENEMY: Deck } = { PLAYER: null as any, ENEMY: null as any }
  private $hand: { PLAYER: Hand; ENEMY: Hand } = { PLAYER: null as any, ENEMY: null as any }

  constructor() {
    super({
      key: SCENE_KEYS.BATTLE_SCENE,
    })
  }

  update(): void {
    super.update()

    // this.stateMachine.update()
  }

  create(): void {
    super.create()

    // Managers
    this.$animationManager = new AnimationManager(this)

    // Background
    new Background(this)

    // Deck
    this.$deck.PLAYER = new Deck(this, TARGET_KEYS.PLAYER, this.$animationManager)
    this.$deck.ENEMY = new Deck(this, TARGET_KEYS.ENEMY, this.$animationManager)

    // Hand
    this.$hand.PLAYER = new Hand(this, TARGET_KEYS.PLAYER, this.$animationManager)
    this.$hand.ENEMY = new Hand(this, TARGET_KEYS.ENEMY, this.$animationManager)

    this.$drawCard(TARGET_KEYS.PLAYER)
  }

  private $drawCard(player: TargetKeys): void {
    this.$deck[player].drawCard((card: Card | undefined) => {
      this.$hand[player].drawCard(card)
    })
  }
}
