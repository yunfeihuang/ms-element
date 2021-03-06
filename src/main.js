import Vue from 'vue'
import Router from 'vue-router'
import routes from './route.config.js'
import store from './store'
import App from './App.vue'
import '@/styles/import.scss'
import ElementUI from '@element-ui'
import * as MS from '../packages'
import DomPortal from 'vue-dom-portal'
import filters from '@/filters'
import '@/directives'
import axios from '@axios'

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(Router)
Vue.use(DomPortal)
Vue.use(ElementUI)
Vue.use(MS)
Vue.prototype.$axios = axios

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

new Vue({ // eslint-disable-line
  router: new Router({
    routes
  }),
  store,
  el: '#app',
  render: h => h(App)
})
