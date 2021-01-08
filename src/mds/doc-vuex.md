
<details>
<summary>将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action</summary>

```
#store/module/user.js
// state
let state = {
  list: []
}

// actions
const actions = {
  list ({ commit, state }, params) { // 获取用户列表
    let data = []
    for (let i = 0; i < 10; i++) { // 模拟请求接口数据
      data.push(Math.random())
    }
    commit('LIST', {
      params: params,
      data: data
    })
  }
}
// mutations
const mutations = {
  LIST (state, { data }) {
    state.list = data
  }
}

export default {
  namespaced: true, // namespaced设置为true是关键点
  state,
  actions,
  mutations
}

# vue组件层
import { mapState } from 'vuex'
export default () {
  computed: {
    ...mapState({
      list: state => state.user.list
    })
  },
  mounted () {
    this.dispatch('user/list') // 触发action
    // this.commit('user/LIST') 触发mutations
  }
}

#参考资料：https://vuex.vuejs.org/zh-cn/modules.html
```
</details>



<details>
<summary>解决store dispatch后获取更新后的数据方案，当然也可以用watch方案</summary>

```
import api from 'api'
// state
let state = {
  list: []
}

// actions
const actions = {
  list ({ commit, state }, params) { // 获取用户列表
    return api.getList().then((data) => { // action要返回Promise dispatch就可以使用then方法
      commit('LIST', {
        params: params,
        data: data
      })
    })
  }
}
// mutations
const mutations = {
  LIST (state, { data }) {
    console.log('into mutations')
    state.list = data
  }
}

export default {
  namespaced: true, // namespaced设置为true是关键点
  state,
  actions,
  mutations
}

# vue组件层
import { mapState } from 'vuex'
export default () {
  computed: {
    ...mapState({
      list: state => state.user.list
    })
  },
  mounted () {
    this.dispatch('user/list').then(() => {
      console.log('into dispatch then', this.$store.state.user.list)
    })
    #console打印结果：先"into mutations"，后"into dispatch then"
  }
}

```
</details>

<details>
<summary>后台接口返回数据处理要store层去完成，要减少vue computed,filter,watch去处理数据，往视图层与业务层分离的原则上开发,Vue视图层只做渲染</summary>

```
bad:
#store层
import api from 'api'
// state
let state = {
  list: []
}

// actions
const actions = {
  list ({ commit, state }, params) { // 获取用户列表
    return api.getList().then((data) => {
      commit('LIST', {
        params: params,
        data: data
      })
    })
  }
}
// mutations
const mutations = {
  LIST (state, { data }) {
    state.list = data
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}

#vue层
import { mapState } from 'vuex'
export default () {
  computed: {
    ...mapState({
      list: state => state.user.list
    })
  },
  watch: {
    list (value) {
      value.forEach(item => {  // 处理返回的数据
        let fullName = '未知'
        if (item.firstName && item.lastName) {
          fullName = item.firstName + item.lastName // 处理完整姓名
        }
        item.fullName = fullName
      })
    }
  },
  mounted () {
    this.dispatch('user/list')
  }
}

good:
#store层
import api from 'api'
// state
let state = {
  list: []
}

// actions
const actions = {
  list ({ commit, state }, params) { // 获取用户列表
    return api.getList().then((data) => {
      commit('LIST', {
        params: params,
        data: data
      })
    })
  }
}
// mutations
const mutations = {
  LIST (state, { data }) {
    data.forEach(item => { // 处理返回的数据
      let fullName = '未知'
      if (item.firstName && item.lastName) {
        fullName = item.firstName + item.lastName // 处理完整姓名
      }
      item.fullName = fullName
    })
    state.list = data
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}

#vue层
import { mapState } from 'vuex'
export default () {
  computed: {
    ...mapState({
      list: state => state.user.list
    })
  },
  mounted () {
    this.dispatch('user/list')
  }
}

```
</details>

<details>
<summary>store单向数据流与表单双向数据流的处理</summary>

```
import { mapState } from 'vuex'
export default () {
  data () {
    return {
      form: {} // 存储表单字段
    }
  },
  computed: {
    ...mapState({
      info: state => state.user.info
    })
  },
  mounted () {
    this.dispatch('user/info').then(() => { // 使用then方法记得在action里返回一个Promise对象
      this.form = {...this.$store.state.user.info} // 把store的用户信息复制一份到form里以便使用双向数据绑定
    })
  }
}
```
</details>