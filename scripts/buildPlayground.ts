import fg from 'fast-glob'
import { copy } from 'fs-extra'

fg.sync('dist/**').forEach(async (file) => {
  Promise.all([copy(file, file.replace(/^dist\//, 'playground/dist/'))]).catch(
    (err) => {
      console.log(`Faild to running scripts of 'buildStyle': ${err}`)
    }
  )
})
