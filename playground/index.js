import NProgress from "../dist/index.js"

window.addEventListener('DOMContentLoaded', () => {
  const start = document.getElementById('btn-start')
  start.onclick = () => {
    NProgress.start()
  }
})