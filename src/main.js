import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import 'element-plus/lib/theme-chalk/index.css'
import ElementPlus from 'element-plus'
import '../packages/style/src/theme/index.scss'
import routes from './route.config.js'
import App from './App.vue'
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
window.$app = app.mount('#app')
