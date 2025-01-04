export class IdCounter {
  private $currentId: number
  private $prefix: string

  constructor(prefix: string) {
    this.$prefix = prefix
    this.$currentId = 0
  }

  public get id(): string {
    this.$currentId += 1
    return this.$prefix + this.$currentId
  }
}
