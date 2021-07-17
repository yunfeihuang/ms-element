import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import routes from './router/designer'
import store from './store'
import App from './Designer.vue'
import '@/styles/import.scss'
import ElementUI from '@element-ui'
import * as MS from '../packages'
import filters from './filters'
import '@/directives'
import axios from '@axios'

const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(Router)
Vue.use(ElementUI)
Vue.use(MS)
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
let loadedRoutes = []
router.beforeEach((to, from, next) => {
  if (!loadedRoutes.find(item => item.path === to.path)) {
    loadedRoutes.push(to)
    NProgress.start()
  }
  next()
})
router.afterEach(() => {
  NProgress.done()
})

new Vue({ // eslint-disable-line
  router,
  store,
  el: '#app',
  render: h => h(App)
})
