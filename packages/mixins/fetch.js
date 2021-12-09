export default {
  data () {
    return {
      loading: false,
      response: null
    }
  },
  watch: {
    loading (value) {
      this.watchLoading(value)
    }
  },
  mounted () {
    this.beforeFetch && this.beforeFetch(this.query)
  },
  methods: {
    refresh () {
      return this.beforeFetch(this.query)
    },
    beforeFetch (query) {
      if (this.fetch) {
        let promise = this.fetch(query)
        if (promise && promise.then) {
          this.loading = true
          return promise.then(res => {
            if (res) {
              this.response = res
            }
            return res
          }).finally(() => {
            this.loading = false
          })
        } else {
          return Promise.resolve()
        }
      } else {
        return Promise.resolve()
      }
    },
    parseResponse (res) {
      let result = null
      const fn = (obj) => {
        let keys = Object.keys(obj)
        if (keys.includes('code') && keys.includes('data')) {
          result = obj.data
        } else if (obj.data) {
          fn(obj.data)
        }
      }
      fn(res)
      return result
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
          this.$loadingInstance = this.$loading({ // 实例化loading对象
            target: this.$el.parentNode.querySelector('.ms-loading-element') || this.$el.parentNode
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
