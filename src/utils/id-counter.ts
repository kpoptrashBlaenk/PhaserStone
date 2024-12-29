export class IdCounter {
  private $currentId: number

  constructor() {
    this.$currentId = 0
  }

  public get id(): number {
    this.$currentId += 1
    return this.$currentId
  }
}
