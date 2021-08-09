import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import routes from './router'
import App from './Designer.vue'
import '@/styles/import.scss'
import ElementUI from '@element-ui'
import * as MS from '../packages'
import axios from 'axios'

const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)
Vue.use(ElementUI)
Vue.use(MS)
Vue.prototype.$axios = axios

Vue.prototype.$const = {
  componentOption: [
    { value: 'el-input', label: '文本输入框' },
    { value: 'el-input-number', label: '数字框' },
    { value: 'el-switch', label: '开关' },
    { value: 'el-select', label: '下拉框' },
    { value: 'el-checkbox-group', label: '复选框' },
    { value: 'el-radio-group', label: '单选框' },
    { value: 'el-upload', label: '上传' },
    { value: 'el-date-picker', label: '日期选择器' },
    { value: 'el-time-picker', label: '时间选择器' },
    { value: 'el-cascader', label: '级联选择器' }
  ]
}
/*
if (process.env.NODE_ENV === 'development') {
  import('@/mock').then(res => {
    res && res.default && res.default()
  })
}
*/
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
  if (to.query.__) {
    to.meta.title = to.query.__
    delete to.query.__
  }
  next()
})
router.afterEach(() => {
  NProgress.done()
})

window.$app = new Vue({ // eslint-disable-line
  router,
  el: '#app',
  render: h => h(App)
})
