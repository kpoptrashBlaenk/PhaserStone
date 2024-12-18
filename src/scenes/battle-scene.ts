import { Deck } from '../objects/deck'
import { Background } from '../ui/background'
import { TARGET_KEYS } from '../utils/keys'
import { BaseScene } from './base-scene'
import { SCENE_KEYS } from './scene-keys'

export class BattleScene extends BaseScene {
  private $deck: { PLAYER: Deck; ENEMY: Deck } = { PLAYER: null as any, ENEMY: null as any }

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

    // Background
    new Background(this)

    // Deck
    this.$deck.PLAYER = new Deck(this, TARGET_KEYS.PLAYER)
    this.$deck.ENEMY = new Deck(this, TARGET_KEYS.OPPONENT)
  }
}
