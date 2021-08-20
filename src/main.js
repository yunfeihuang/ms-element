import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './router'
import App from './App.vue'
import 'element-plus/lib/theme-chalk/index.css'
import ElementPlus from 'element-plus'
import '../packages/style/src/theme/index.scss'
import * as MS from '../packages'
import axios from './axios'

const $createApp = (...args) => {
  const app = createApp(...args).use(ElementPlus, {
    inputNumber: {
      'controls-position': 'right'
    }
  }).use(MS)
  app.config.performance = true
  app.config.globalProperties.$axios = axios
  return app
}

const app = $createApp(App).use(createRouter({
  history: createWebHashHistory(),
  routes: routes
}))

window.$app = app.mount('#app')
window.$createApp = $createApp

let initRootFontSize = function () {
  let width = window.innerWidth
  if (window.devicePixelRatio > 1 && document.ontouchstart !== undefined) {
    width = width * window.devicePixelRatio
  }
  let fontSize = 12
  fontSize = 14 / 1643 * width
  if (fontSize > 14) {
    fontSize = 14
  }
  if (fontSize < 12) {
    fontSize = 12
  }
  document.documentElement.style.fontSize = `${fontSize}px`// 计算设计稿和实际像素的缩放比。向上取整1px = 0.01rem
}
window.addEventListener('resize', initRootFontSize)
initRootFontSize()