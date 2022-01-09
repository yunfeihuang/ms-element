import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './router'
import App from './Demo.vue'
import 'element-plus/theme-chalk/index.css'
import './assets/styles/el-icon.css'
import ElementPlus from 'element-plus'
import '../packages/style/src/theme/index.scss'
import MsElement from '../packages'
import axios from './axios'

const app = createApp(App).use(ElementPlus, {
  inputNumber: {
    'controls-position': 'right'
  }
}).use(MsElement).use(createRouter({
  history: createWebHashHistory(),
  routes: routes
}))
app.config.performance = true
app.config.globalProperties.$axios = axios
console.log('app', app)
window.$app = app.mount('#app')

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