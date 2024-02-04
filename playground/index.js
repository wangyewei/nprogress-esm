import Progress from './dist/index.js'

window.addEventListener('DOMContentLoaded', () => {
  const start = document.getElementById('start')
  const set = document.getElementById('set')
  const done = document.getElementById('done')
  Progress.configure({ primaryColor: 'red' })
  start.onclick = () => {
    Progress.start()
  }

  set.onclick = () => {
    Progress.set(40)
  }

  done.onclick = () => {
    Progress.done()
  }
})
