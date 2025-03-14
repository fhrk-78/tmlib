# tmlib

## Usage

簡単なコード

```html
<canvas id="map"></canvas>
```

```ts
import Renderer, { Drag } from '@fhrk-78/tmlib_ctx2d'

const r = new Renderer('#map')
  .init({ resizeTo: window })
  .start(120)

r.onRender.register((c) => {
  // c is RenderingContext2d
})
```

## Plugins

### `/drag`

ドラッグを可能にする

```ts
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
```
