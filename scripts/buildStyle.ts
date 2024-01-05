import fg from 'fast-glob'
import { copy } from 'fs-extra'

fg.sync('packages/**.css').forEach(async (file) => {
  Promise.all([copy(file, file.replace(/^packages\//, 'dist/'))]).catch(
    (err) => {
      console.log(`Faild to running scripts of 'buildStyle': ${err}`)
    }
  )
})
