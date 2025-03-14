import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: './lib/main.ts',
      name: 'TMLib-Ctx2d',
      fileName: 'tmlib',
    },
  },
  plugins: [dts({
    rollupTypes: true,
    tsconfigPath: './tsconfig.json',
    insertTypesEntry: true,
    include: ['lib']
  })],
})
