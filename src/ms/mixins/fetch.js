export default {
  data () {
    return {
      loading: false,
      res: null
    }
  },
  watch: {
    loading (value) {
      if (this.$target) {
        this.$emit('loading', value)
      } else {
        if (value) {
          if (this.$loadingInstance) {
            this.$loadingInstance.close()
          }
          this.$loadingInstance = this.$loading({ // 实例化loading对象
            target: this.$el
          })
        } else {
          if (this.$loadingInstance) {
            this.$loadingInstance.close()
          }
        }
      }
    }
  },
  mounted () {
    this.beforeFetch()
  },
  methods: {
    beforeFetch () {
      let promise = this.fetch()
      if (promise && promise.then) {
        this.loading = true
        return promise.then(res => {
          console.log(res)
          this.loading = false
          this.res = this.parseResponse(res)
          return res
        }).catch(err => {
          this.loading = false
          return err
        })
      }
    },
    parseResponse (res) {
      return res
    },
    fetch () {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, 1000)
      })
    }
  }
}


