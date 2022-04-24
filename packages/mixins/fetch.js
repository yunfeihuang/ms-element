
const parseResponse = (res) => {
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
}
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
    this.fetchDataSource && this.fetchDataSource()
    this.beforeFetch && this.beforeFetch(this.query)
  },
  methods: {
    fetchDataSource () {
      const f = (ds) => {
        ds.option && this.$axios(ds.option).then(res => {
          ds.data = parseResponse(res)
        })
      }
      if (this.dataSource && this.$axios) {
        for (let name in this.dataSource) {
          f(this.dataSource[name])
        }
      }
    },
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
    parseResponse: parseResponse,
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
      }
    }
  }
}
