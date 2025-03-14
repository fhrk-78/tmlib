export class SyncEvent<T, U> {
  private events = [] as ((e: T) => U)[]

  public constructor() {}

  public register(e: (e: T) => U): this {
    this.events.push(e)
    return this
  }

  public emit(e: T): void {
    for (const fn of this.events) fn(e)
  }
}

export class AsyncEvent<T, U> extends SyncEvent<T, Promise<U>> {}
