import Vue from 'vue'
import focus from './focus'
import preview from './preview'
// 注册一个全局自定义指令 v-focus
Vue.directive('focus', focus)
Vue.directive('dev', {
  // 当绑定元素插入到 DOM 中。
  inserted (el, binding, vnode, oldVnode) {
    if (process.env.NODE_ENV !== 'production') {
      el.classList.add('is-dev')
    }
  }
})
Vue.directive('preview', preview)
