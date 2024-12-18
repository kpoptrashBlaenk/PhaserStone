import { BattleScene } from '../scenes/battle-scene'
import { TARGET_KEYS, TargetKeys } from '../../../src/utils/keys'
import { repositionContainer, resizeContainer } from '../common/resize-container'
import { BOARD_POSITION_Y, HAND_CARD_SIZE, HAND_CONFIGS } from '../utils/visual-configs'
import { HandCard } from './card/hand-card'

export class Hand {
  private scene: BattleScene
  private owner: TargetKeys
  private handContainer: Phaser.GameObjects.Container
  private hand: HandCard[]

  constructor(scene: BattleScene, owner: TargetKeys) {
    this.scene = scene
    this.owner = owner

    this.hand = []
    // Always above board cards
    this.handContainer = this.createHandContainer().setDepth(1)
    this.resizeHandContainer()
  }

}
