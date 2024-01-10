import Progress from "../dist/index.js"

window.addEventListener('DOMContentLoaded', () => {
  const start = document.getElementById('btn-start')
  const done = document.getElementById('btn-done')
  start.onclick = () => {
    Progress.start()
  }

  done.onclick = () => {
    Progress.done()
  }
})