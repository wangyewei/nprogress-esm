import Progress from './dist/index.js'

window.addEventListener('DOMContentLoaded', () => {
  const start = document.getElementById('start')
  const set = document.getElementById('set')
  const done = document.getElementById('done')

  const createChild = document.getElementById('create_child')

  let childProgress
  const startChild = document.getElementById('child_start')
  const setChild = document.getElementById('set_child')
  const doneChild = document.getElementById('child_done')

  start.onclick = () => {
    Progress.start()
  }

  set.onclick = () => {
    Progress.set(40)
  }

  done.onclick = () => {
    Progress.done()
  }

  createChild.onclick = () => {
    childProgress = Progress.create()
    childProgress.configure({ parent: 'h1' })
  }

  startChild.onclick = () => {
    childProgress.start()
  }

  doneChild.onclick = () => {
    childProgress.done()
  }
})
