export default {
  data () {
    return {
      loading: false,
      res: {}
    }
  },
  watch: {
    loading (value) {
      this.watchLoading(value)
    }
  },
  mounted () {
    this.beforeFetch()
  },
  methods: {
    refresh () {
      return this.beforeFetch()
    },
    beforeFetch () {
      if (this.fetch) {
        let promise = this.fetch()
        if (promise && promise.then) {
          this.loading = true
          return promise.then(res => {
            this.res = this.parseResponse(res)
            return res
          }).finally(res => {
            this.loading = false
          })
        }
      }
    },
    parseResponse (res) {
      return res
    },
    /*
    fetch () {
      return new Promise((resolve, reject) => {
        setTimeout(resolve({}), 1000)
      })
    },
    */
    watchLoading (value) {
      if (this['msDrawer']) {
        this.$emit('loading', value)
      } else {
        if (value) {
          if (this.$loadingInstance) {
            this.$loadingInstance.close()
          }
          this.$loadingInstance = this.$loading({ // 实例化loading对象
            target: this.$el.querySelector('.ms-loading-element') || this.$el
          })
        } else {
          if (this.$loadingInstance) {
            this.$loadingInstance.close()
          }
        }
      }
    }
  }
}
