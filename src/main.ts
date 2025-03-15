import Renderer from '../lib/main'
import Drag, { DragRelayData } from './../lib/plugins/drag'

const r = new Renderer('#map')
  .init({ resizeTo: window })
  .use([ new Drag() ])
  .start(60)

r.onRender.register(c => {
  if (Drag.hasRelayType(c.data)) {
    const drag: DragRelayData = c.data.drag

    c.ctx.fillStyle = 'red'
    const [x, y, w, h] = [11.4, 51.4, 81.0, 36.4]
    c.ctx.fillRect(drag.x + x, drag.y + y, w, h)
  }
})

const global = globalThis as any

global.renderer = r
