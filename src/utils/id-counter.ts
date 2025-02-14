/**
 * The IdCounter class keeps track and gives the id of each card that appears to differentiate them
 */
export class IdCounter {
  private $currentId: number
  private $prefix: string

  constructor(prefix: string) {
    this.$prefix = prefix
    this.$currentId = 0
  }

  /**
   * Return next id
   */
  public get id(): string {
    this.$currentId += 1
    return this.$prefix + this.$currentId
  }
}
