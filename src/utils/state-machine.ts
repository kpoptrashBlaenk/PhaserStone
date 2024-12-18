import { States } from '../utils/keys'

type State = {
  name: States
  onEnter?: (data?: any) => void
}

export class StateMachine {
  private states: Map<string, State>
  private currentState: State | undefined
  private readonly id: string
  private readonly context: Object | undefined
  private isChangingState: boolean
  private ChangingStateQueue: { name: States; data?: any }[]

  constructor(id: string, context: Object | undefined) {
    this.id = id
    this.context = context
    this.isChangingState = false
    this.ChangingStateQueue = []
    this.currentState = undefined
    this.states = new Map()
  }

  public get currentStateName(): States | undefined {
    return this.currentState?.name
  }

  update(): void {
    if (this.ChangingStateQueue.length > 0) {
      const { name, data } = this.ChangingStateQueue.shift()!
      this.setState(name, data)
    }
  }

  public setState(name: States, data?: any): void {
    const methodName = 'setState'

    if (!this.states.has(name as States)) {
      console.warn(
        `[${StateMachine.name}-${this.id}:${methodName}] tried to change to unknown state: ${name}`
      )
      return
    }

    if (this.isCurrentState(name as States)) {
      return
    }

    if (this.isChangingState) {
      this.ChangingStateQueue.push({ name, data })
      return
    }

    this.isChangingState = true

    this.currentState = this.states.get(name as States)

    if (this.currentState) {
      console.log(`[${StateMachine.name}-${this.id}:${methodName}] changed to state: ${name}`)
      this.currentState.onEnter?.(data)
    }

    this.isChangingState = false
  }

  public addState(state: State): void {
    this.states.set(state.name, {
      name: state.name,
      onEnter: this.context ? state.onEnter?.bind(this.context) : state.onEnter,
    })
  }

  private isCurrentState(name: States): boolean {
    if (!this.currentState) {
      return false
    }
    return this.currentState.name === name
  }
}
