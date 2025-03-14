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
  .start(60)

r.onRender.register((c) => {
  // c is RenderingContext2d
})
```

## Plugins

### `/drag`

ドラッグを可能にする

```ts
const drag = new Drag()
const r = new Renderer('#map')
  .init({ resizeTo: window })
  .use([ drag ])
  .start(60)

drag.dragOnRender.register((c) => {
  // c.ctx is RenderingContext2d, c.x & c.y is position
})
```
