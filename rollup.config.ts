import { createRequire } from 'module'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { type RollupOptions, defineConfig } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import json from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'
import alias from '@rollup/plugin-alias'
import dts from 'rollup-plugin-dts'
import terser from '@rollup/plugin-terser'

const _require = createRequire(import.meta.url)
const pkg = _require('./package.json')

const ROOT = fileURLToPath(import.meta.url)
const r = (p: string) => resolve(ROOT, '..', p)
const external = [...Object.keys(pkg['dependencies'] || {})]
const plugins = [
  alias({
    entries: {
      'readable-stream': 'stream',
    },
  }),
  replace({
    'navigator.userAgentData': 'undefined',
    'navigator.userAgent': 'undefined',
    preventAssignment: true,
  }),
  commonjs(),
  nodeResolve({ preferBuiltins: false }),
  esbuild({ target: 'node14' }),
  json(),
  terser()
]
const esmBuild: RollupOptions = {
  input: r('packages/index.ts'),
  output: {
    format: 'esm',
    entryFileNames: `[name].js`,
    chunkFileNames: 'serve-[hash].js',
    dir: r('dist/'),
  },
  external,
  plugins,
  onwarn(warning, warn) {
    if (warning.code !== 'EVAL') warn(warning)
  },
}

const typing: RollupOptions = {
  input: r('packages/index.ts'),
  output: {
    format: 'esm',
    file: 'dist/index.d.ts',
  },
  external,
  plugins: [dts()],
}

const config = defineConfig([])
config.push(esmBuild)
config.push(typing)

export default config
