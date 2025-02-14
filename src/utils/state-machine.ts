import { States } from '../utils/keys'

type State = {
  name: States
  onEnter?: (data?: any) => void
}

/**
 * The StateMachine class is the state engine
 */
export class StateMachine {
  private $states: Map<string, State>
  private $currentState: State | undefined
  private readonly $id: string
  private readonly $context: Object | undefined
  private $isChangingState: boolean
  private $changingStateQueue: { name: States; data?: any }[]

  constructor(id: string, context: Object | undefined) {
    this.$id = id
    this.$context = context
    this.$isChangingState = false
    this.$changingStateQueue = []
    this.$currentState = undefined
    this.$states = new Map()
  }

  /**
   * Returns {@link currentState}
   */
  public get currentStateName(): States | undefined {
    return this.$currentState?.name
  }

  /**
   * If states in {@link $changingStateQueue} then {@link setState}
   */
  update(): void {
    if (this.$changingStateQueue.length > 0) {
      const { name, data } = this.$changingStateQueue.shift()!
      this.setState(name, data)
    }
  }

  /**
   * Set new state
   * 
   * @param name {@link States}
   * @param data Data to pass to the state
   */
  public setState(name: States, data?: any): void {
    const methodName = 'setState'

    if (!this.$states.has(name as States)) {
      console.warn(
        `[${StateMachine.name}-${this.$id}:${methodName}] tried to change to unknown state: ${name}`
      )
      return
    }

    // Avoiding repetition
    if (this.isCurrentState(name as States)) {
      return
    }

    // Queue state if state is being executed
    if (this.$isChangingState) {
      this.$changingStateQueue.push({ name, data })
      return
    }

    this.$isChangingState = true
    this.$currentState = this.$states.get(name as States)

    if (this.$currentState) {
      console.log(`[${StateMachine.name}-${this.$id}:${methodName}] changed to state: ${name}`)
      this.$currentState.onEnter?.(data)
    }

    this.$isChangingState = false
  }

  /**
   * Add a new state
   * 
   * @param state A state with a name and an onEnter
   */
  public addState(state: State): void {
    this.$states.set(state.name, {
      name: state.name,
      onEnter: this.$context ? state.onEnter?.bind(this.$context) : state.onEnter,
    })
  }

  /**
   * Check if state is equal to {@link $currentState}
   * 
   * @param name {@link States}
   * @return If state is being executed
   */
  private isCurrentState(name: States): boolean {
    if (!this.$currentState) {
      return false
    }
    return this.$currentState.name === name
  }
}
