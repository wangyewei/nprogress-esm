import minify from '@node-minify/core'
import minifyCleanCSS from '@node-minify/clean-css'

minify({
  compressor: minifyCleanCSS,
  input: 'packages/style.css',
  output: 'dist/style.css',
})
