import Vue from 'vue'
import Vuex from 'vuex'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import user from './modules/user'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

// state
let state = {
  loading: false,
  global: { // 公共数据
    user: {}
  }
}

// actions
const actions = {}

// mutations
const mutations = {
  LOADING (state, data) {
    state.loading = data
    if (data) {
      NProgress.start()
    } else {
      NProgress.done()
    }
  }
}

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  modules: {
    user
  },
  strict: false,
  debug: debug
})

export default store
