import Vue from 'vue'
import focus from './focus'
import preview from './preview'
// 注册一个全局自定义指令 v-focus
Vue.directive('focus', focus)
Vue.directive('preview', preview)
