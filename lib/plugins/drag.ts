import Renderer, { TMLibPlugin } from '../main'
import { SyncEvent } from '../utils'

export type DragPluginRenderer = {
  x: number
  y: number
  ctx: CanvasRenderingContext2D
}

export default class Drag implements TMLibPlugin {
  public constructor() {}

  public startX = 0;
  public startY = 0;
  public isDragging = false;

  public x = 0
  public y = 0

  /**
   * @deprecated
   */
  public dragOnRender = new SyncEvent<DragPluginRenderer, void>()

  public onRender = (c: CanvasRenderingContext2D) => {
    this.dragOnRender.emit({ x: this.x, y: this.y, ctx: c })
  }

  public init(r: Renderer) {
    r.canvas.onmousedown = (e) => {
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.isDragging = true;
    }

    r.canvas.onmousemove = (e) => {
      if (!this.isDragging) return;
      const rect = r.canvas.getBoundingClientRect()
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        this.isDragging = false
        return
      }
      this.x += e.clientX - this.startX;
      this.y += e.clientY - this.startY;
      this.startX = e.clientX;
      this.startY = e.clientY;
    }

    r.canvas.onmouseup = () => {
      this.isDragging = false;
    }
  }

  public relay(data: any) {
    return {
      ...data,
      drag: {
        x: this.x,
        y: this.y,
        isDragging: this.isDragging
      } as DragRelayData
    }
  }

  public static hasRelayType(data: any): boolean {
    return data !== undefined && data.drag !== undefined && data.drag.x !== undefined && typeof data.drag.x === 'number' && data.drag.y !== undefined &&
      typeof data.drag.y === 'number' && data.drag.isDragging !== undefined && typeof data.drag.isDragging === 'boolean'
  }
}

export type DragRelayData = {
  x: number;
  y: number;
  isDragging: boolean;
}
