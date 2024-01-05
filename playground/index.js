import NProgress from "../dist/index.js"

window.addEventListener('DOMContentLoaded', () => {
  const start = document.getElementById('btn-start')
  const done = document.getElementById('btn-done')
  start.onclick = () => {
    NProgress.start()
  }

  done.onclick = () => {
    NProgress.done()
  }
})