import Vue from 'vue'
import Router from 'vue-router'
import routes from './router'
import store from './store'
import App from './Demos.vue'
import '@/styles/import.scss'
import ElementUI from '@element-ui'
import * as EUI from './components/management'
import DomPortal from 'vue-dom-portal'
import filters from '@/filters'
import '@/directives'
import axios from '@axios'
console.log('mixins', $mixins)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(Router)
Vue.use(DomPortal)
Vue.use(ElementUI)
Vue.use(EUI)
Vue.prototype.$axios = axios

if (process.env.NODE_ENV === 'development') {
  import('@/mock').then(res => {
    res && res.default && res.default()
  })
}
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
let router = new Router({
  routes
})
router.beforeEach((to, from, next) => {
  window.$$loadingTimer && clearTimeout(window.$$loadingTimer)
  store.commit('LOADING', true)
  next()
})
router.afterEach(() => {
  window.$$loadingTimer = setTimeout(() => {
    store.commit('LOADING', false)
  }, 200)
  window.$$onComplete = () => {
    store.commit('LOADING', false)
  }
})
window.Vue = Vue
new Vue({ // eslint-disable-line
  router,
  store,
  el: '#app',
  render: h => h(App)
})
