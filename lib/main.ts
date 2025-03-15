import { SyncEvent, AsyncEvent } from './utils'
import Drag from './plugins/drag'

export { Drag }

export type TMLibInitializeOptions = {
  resizeTo?: HTMLElement | Window
}

export interface TMLibPlugin {
  onBeforeRender?: (c:CanvasRenderingContext2D) => void
  onRender?: (c:CanvasRenderingContext2D) => void
  onAfterRender?: (c:CanvasRenderingContext2D) => Promise<void>

  init?: (r: Renderer) => void
  relay?: (data: any) => any
}

export type RenderCallback = {
  ctx: CanvasRenderingContext2D,
  data: any
}

/**
 * TMLib Main Renderer
 */
export default class Renderer {
  public canvas: HTMLCanvasElement
  public ctx: CanvasRenderingContext2D
  private interval: number|null = null
  private options: TMLibInitializeOptions = {}

  public constructor(target: HTMLCanvasElement | string) {
    if (target instanceof HTMLCanvasElement) {
      this.canvas = target
      const ctx2d = target.getContext('2d')
      if (ctx2d === null) throw new CannotGetContextError()
      this.ctx = ctx2d
    } else {
      const element = document.querySelector(target)
      if (!element) throw new ElementNotFoundError()
      if (!(element instanceof HTMLCanvasElement)) throw new ElementIsNotCanvasError()
      this.canvas = element
      const ctx2d = element.getContext('2d')
      if (ctx2d === null) throw new CannotGetContextError()
      this.ctx = ctx2d
    }
  }

  /**
   * Set options.
   * @param options options
   */
  public init(options: TMLibInitializeOptions): Renderer {
    this.options = options
    return this
  }

  public onBeforeRender = new SyncEvent<CanvasRenderingContext2D, void>()
  public onRender = new SyncEvent<RenderCallback, void>()
  public onAfterRender = new AsyncEvent<RenderCallback, void>()

  private plugins: TMLibPlugin[] = []

  public render(): Renderer {
    this.plugins.forEach(plugin => plugin.onRender?.(this.ctx))
    this.onBeforeRender.emit(this.ctx)

    if (this.options.resizeTo) {
      if (this.options.resizeTo instanceof Window) {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.canvas.style.width = `${this.canvas.width}px`
        this.canvas.style.height = `${this.canvas.height}px`
      } else {
        this.canvas.width = this.options.resizeTo.clientWidth
        this.canvas.height = this.options.resizeTo.clientHeight
        this.canvas.style.width = `${this.canvas.width}px`
        this.canvas.style.height = `${this.canvas.height}px`
      }
    }

    let relay: any = {}

    this.plugins.forEach(plugins => plugins.onRender?.(this.ctx))
    this.plugins.forEach(plugins => relay = plugins.relay?.(relay))
    this.onRender.emit({ ctx: this.ctx, data: relay })

    this.plugins.forEach(plugins => plugins.onAfterRender?.(this.ctx))
    this.onAfterRender.emit({ ctx: this.ctx, data: relay })
    return this
  }

  /**
   * Apply plugins to the renderer.
   * @param plugin Plugin to use.
   */
  public use(plugin: TMLibPlugin | TMLibPlugin[]): Renderer {
    if (Array.isArray(plugin)) {
      plugin.forEach((plugin) => this.use(plugin))
      return this
    } else {
      if (plugin.init)
        plugin.init(this)
      this.plugins.push(plugin)
      return this
    }
  }

  /**
   * Start render loop.
   * @param fps Canvas FPS
   */
  public start(fps: number): Renderer {
    this.interval = setInterval(() => {
      this.render()
    }, 1000 / fps)
    return this
  }

  /**
   * Stop render loop.
   */
  public stop(): Renderer {
    if (this.interval) clearInterval(this.interval)
    return this
  }
}

/**
 * HTML Element must be <canvas></canvas>
 */
export class ElementIsNotCanvasError extends Error {}

/**
 * Element can't be found.
 */
export class ElementNotFoundError extends Error {}

/**
 * Failed to get context.
 */
export class CannotGetContextError extends Error {}
