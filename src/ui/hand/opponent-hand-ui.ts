import { TargetKeys } from '../../event-keys'
import { Card } from '../../gameObjects/card'
import { OpponentHandCardUI } from '../card/opponent-hand-card-ui'
import { BaseHandUI } from './hand-ui'

export class OpponentHandUI extends BaseHandUI {
  constructor(
    scene: Phaser.Scene,
    onPlayCallback: (card: Card) => void,
    owner: TargetKeys,
    emitter: Phaser.Events.EventEmitter
  ) {
    super(scene, onPlayCallback, owner, emitter)
  }

  public drawCard(card: Card): void {
    const cardContainer = new OpponentHandCardUI(this.scene, card)
    this.handContainer.add(cardContainer.cardContainer)
    cardContainer.cardContainer.setData('handCardUI', cardContainer)
    this.resizeHandContainer()
  }

  protected setPosition(): void {
    this.handContainer.setPosition(this.scene.scale.width / 2 - this.handContainer.width / 2, 0)
  }
}
