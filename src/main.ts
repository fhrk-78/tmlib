import Renderer from '../lib/main'
import Drag from './../lib/plugins/drag'

const dragger = new Drag()

const r = new Renderer('#map')
  .init({ resizeTo: window })
  .use([ dragger ])
  .start(60)

dragger.dragOnRender.register((c) => {
  c.ctx.fillStyle = 'red'
  const [x, y, w, h] = [11.4, 51.4, 81.0, 36.4]
  c.ctx.fillRect(c.x + x, c.y + y, w, h)
})

const global = globalThis as any

global.renderer = r
global.dragger = dragger
