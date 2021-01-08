export default {
  props: {
    popupName: {
      type: String
    },
    popupManager: {
      type: [Object]
    },
    query: { // 表单弹框时的参数传值
      type: [Number, Object, String, Array]
    }
  },
  data () {
    return {
      fetching: false
    }
  },
  watch: {
    fetching (value) {
      // this.toggleLoading(value)
    }
  },
  mounted () {
    this.$emit('mounted', this.$el)
    this.beforeFetch && this.beforeFetch()
  },
  methods: {
    closeDrawerLoading () {
      let mask = this.$el.closest('.e-drawer').querySelector('.e-drawer--mask')
      mask.style.opacity = 0
      setTimeout(() => {
        mask.style.display = 'none'
      }, 310)
    },
    handleBackIn () { // 关闭前一个弹框后进到当前弹框被触发
      console.log('handleBackIn')
    },
    toggleLoading (value) {
      let drawerNode = this.$el.closest('.e-drawer')
      if (drawerNode) {
        if (value) {
          this.$loadingInstance = this.$loading({ // 实例化loading对象
            target: drawerNode,
            fullscreen: false
          })
        } else {
          if (this.$loadingInstance) { // 结束loading效果
            this.$loadingInstance.close()
            this.$loadingInstance = null
          }
        }
      }
    },
    beforeFetch () {
      if (this.fetch) {
        let promise = this.fetch()
        if (promise) {
          this.fetching = true
          let finish = () => {
            this.fetching = false
            this.closeDrawerLoading()
          }
          promise.then(finish).catch(finish)
        } else {
          this.closeDrawerLoading()
        }
      } else {
        this.closeDrawerLoading()
      }
    },
    handleClose () {
      this.$emit('close')
    }
  }
}
