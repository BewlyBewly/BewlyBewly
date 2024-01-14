// copy with vscode

interface IdleDeadline {
  readonly didTimeout: boolean
  timeRemaining(): number
}

interface IDisposable {
  dispose(): void
}

/**
 * Execute the callback the next time the browser is idle, returning an
 * {@link IDisposable} that will cancel the callback when disposed. This wraps
 * [requestIdleCallback] so it will fallback to [setTimeout] if the environment
 * doesn't support it.
 *
 * @param callback The callback to run when idle, this includes an
 * [IdleDeadline] that provides the time alloted for the idle callback by the
 * browser. Not respecting this deadline will result in a degraded user
 * experience.
 * @param timeout A timeout at which point to queue no longer wait for an idle
 * callback but queue it on the regular event loop (like setTimeout). Typically
 * this should not be used.
 *
 * [IdleDeadline]: https://developer.mozilla.org/en-US/docs/Web/API/IdleDeadline
 * [requestIdleCallback]: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
 * [setTimeout]: https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout
 */

// eslint-disable-next-line import/no-mutable-exports
export let runWhenIdle: (callback: (idle: IdleDeadline) => void, timeout?: number) => IDisposable

declare function requestIdleCallback(callback: (args: IdleDeadline) => void, options?: { timeout: number }): number
declare function cancelIdleCallback(handle: number): void;

(function () {
  if (typeof requestIdleCallback !== 'function' || typeof cancelIdleCallback !== 'function') {
    runWhenIdle = (runner) => {
      let disposed = false
      setTimeout(() => {
        if (disposed)
          return
        const end = Date.now() + 15 // one frame at 64fps
        runner(Object.freeze({
          didTimeout: true,
          timeRemaining() {
            return Math.max(0, end - Date.now())
          },
        }))
      })
      return {
        dispose() {
          if (disposed)
            return
          disposed = true
        },
      }
    }
  }
  else {
    runWhenIdle = (runner, timeout?) => {
      const handle: number = requestIdleCallback(runner, typeof timeout === 'number' ? { timeout } : undefined)
      let disposed = false
      return {
        dispose() {
          if (disposed)
            return

          disposed = true
          cancelIdleCallback(handle)
        },
      }
    }
  }
})()

// TODO: handle error
export class LazyValue<T> {
  private _value: T | undefined
  private _didRun = false

  constructor(
    private executor: () => T,
  ) {}

  get value(): T {
    if (!this._didRun) {
      this._value = this.executor()
      this._didRun = true
    }
    return this._value!
  }
}
