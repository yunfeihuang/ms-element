import fetch from './fetch'
export default {
  mixins: [fetch],
  provide () {
    return {
      'msPageList': this
    }
  },
  props: {
    history: { // 列表分页是否产生历史记录
      type: Boolean
    },
    params: {
      type: Object
    },
    fixedTableHead: {
      type: Boolean,
      default () {
        return true
      }
    },
    excludeValue: {
      type: Array,
      default () {
        return [null, undefined, '']
      }
    }
  },
  computed: {
    isHistory () {
      return this.isRouterView || this.history
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.isRouterView = true
    })
  },
  data () {
    return {
      multipleSelectionAll: [], // 全部选中的数据
      multipleSelection: [], // 当前页选中的数据
      pageData: {
        data: [],
        count: 0
      },
      tableBodyHeight: 200
    }
  },
  watch: {
    pageData (value) { // 监听pageData更新列表选中的数据
      if (this.multipleSelectionProp && value && value.data && value.data.filter) {
        let multipleSelectionId = this.multipleSelectionAll.map(item => item[this.multipleSelectionProp])
        let multipleSelection = value.data.filter(item => {
          return multipleSelectionId.indexOf(item[this.multipleSelectionProp]) > -1
        })
        this.$$disabledSelectionChange = true
        this.$nextTick(() => {
          multipleSelection.forEach(item => {
            this.$refs.table && this.$refs.table.toggleRowSelection(item, true)
          })
        })
        setTimeout(() => {
          this.$$disabledSelectionChange = false
        }, 500)
      }
    }
  },
  mounted () {
    this.handleResize()
    window.addEventListener('resize', this.handleResize, false)
  },
  activated () {
    this.handleResize()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    triggerFetch (query) {
      this.$fetchTimer && clearTimeout(this.$fetchTimer)
      this.$fetchTimer = setTimeout(() => {
        this.beforeFetch(query)
      })
    },
    parseResponse (res) {
      this.pageData = res.data
      return res
    },
    fetch (query) {}, // 需要被重写并返回Promise， 初始化会执行，路由参数变化也会执行
    getIndexColumnProps () {
      return {
        label: '序号',
        type: 'index',
        className: 'el-table-column--index',
        index: this.indexMethod
      }
    },
    indexMethod (index) {
      let result = (Number(this.query.page) - 1) * Number(this.query.rows) + (index + 1)
      if (result > 999) {
        return '999+'
      }
      return result
    },
    getQuery (query) { // 获取请求参数
      if (this.params) {
        Object.keys(this.params).forEach(key => {
          if (!query[key]) {
            query[key] = this.params[key]
          }
        })
      }
      if (!this.$$query && query) { // 保存初始化查询对象
        this.$$query = {
          ...query
        }
      }
      return Object.assign({page: 1, rows: 20}, this.params || {}, this.$route && this.isHistory ? this.$route.query : {}, query)
    },
    queryFilter (query) {
      let result = {...query}
      for (let name in result) {
        if (this.excludeValue.includes(result[name])) {
          delete result[name]
        }
      }
      return result
    },
    getPaginationProps (data = {}) { // 获取分页默认props
      if (data.count !== undefined) {
        data.total = data.count
      }
      let props = {
        pagerCount: 5,
        layout: 'total, prev, pager, next, sizes, jumper',
        background: true,
        pageSize: 20,
        currentPage: 1,
        total: data.total,
        pageSizes: [10, 15, 20, 30, 40, 50, 100]
      }
      if (data && data.total && this.query) {
        let query = this.query
        let rows = query.rows ? Number(query.rows) : 20
        let page = query.page ? Number(query.page) : 1
        Object.assign(props, {
          rows,
          page
        })
        if (process.browser && document.ontouchstart !== undefined) {
          Object.assign(props, {
            layout: 'total, prev, pager, next, sizes',
            pagerCount: 3
          })
        }
        return props
      } else {
        return {
          ...props,
          style: {
            display: 'none'
          }
        }
      }
    },
    getTableProps (props) { // 获取表格默认props
      return Object.assign({
        ref: 'table',
        class: 'table-primary',
        height: !this.fixedTableHead ? undefined : this.tableBodyHeight,
        size: 'small',
        data: this.pageData.data
      }, props)
    },
    getTableListeners () {
      return {
        'selection-change': this.handleSelectionChange
      }
    },
    getFormProps (props) { // 获取默认表单props
      return Object.assign({
        novalidate: 'novalidate',
        inline: true,
        size: 'small',
        ref: 'search',
        model: this.query
      }, props)
    },
    getSearchForm (props) {
      return this.getFormProps(props)
    },
    handleTab () {
      let query = Object.assign(this.query, {page: 1})
      this.$router.replace({
        path: this.$route.path,
        query: this.queryFilter(query)
      })
    },
    handleRangeInput (value, keys = ['start_time', 'end_time']) {
      if (value && value[0]) {
        this.query[keys[0]] = value[0]
        this.query[keys[1]] = value[1]
      } else {
        keys.forEach(item => {
          this.query[item] = null
        })
      }
    },
    handleClearSelection () {
      this.$refs.table && this.$refs.table.clearSelection && this.$refs.table.clearSelection()
      this.multipleSelection = this.multipleSelectionAll = []
    },
    handleResize () {
      this.$nextTick(() => {
        if (this.fixedTableHead) {
          let node = this.$el.querySelector('.ms-page-list-layout--table')
          node && (this.tableBodyHeight = node.offsetHeight + '')
        }
      })
    },
    handleCurrentChange (value) { // 修改页数事件
      if (value != this.query.page) { //eslint-disable-line
        let query = Object.assign({}, this.query, {page: value})
        this.updateRoute && this.updateRoute(query)
      }
    },
    handleSizeChange (value) { // 修改分页条数事件
      let query = Object.assign({}, this.query, {page: 1, rows: value})
      this.updateRoute && this.updateRoute(query)
    },
    updateRoute (query) { // 更新URL地址
      if (this.isHistory) {
        this.$router.push({path: this.$route.path, query: this.queryFilter(query)})
      } else {
        this.query = this.queryFilter(query)
        this.triggerFetch(this.queryFilter(query))
      }
    },
    handleSubmit () { // 表单提交事件
      this.query.page = 1
      this.updateRoute(this.query)
    },
    handleReset () {
      this.query = Object.assign({page: 1, rows: 20}, this.$$query)
      // this.triggerFetch(this.query)
      this.$refs.search && this.$refs.search.resetFields && this.$refs.search.resetFields()
    },
    handleSelectionChange (value) {
      let oldValue = JSON.parse(JSON.stringify(this.multipleSelection))
      if (this.multipleSelectionProp && !this.$$disabledSelectionChange) {
        let multipleSelectionAll = JSON.parse(JSON.stringify(this.multipleSelectionAll))
        let multipleSelectionId = multipleSelectionAll.map(item => item[this.multipleSelectionProp])
        if (value.length > oldValue.length) {
          value.forEach(item => {
            if (multipleSelectionId.indexOf(item[this.multipleSelectionProp]) === -1) {
              multipleSelectionAll.push(item)
            }
          })
          this.multipleSelectionAll = multipleSelectionAll
        } else if (value.length < oldValue.length) {
          let valueId = value.map(item => item[this.multipleSelectionProp])
          let deleteId = []
          oldValue.forEach(item => {
            let prop = item[this.multipleSelectionProp]
            if (valueId.indexOf(prop) === -1) {
              deleteId.push(prop)
            }
          })
          this.multipleSelectionAll = this.multipleSelectionAll.filter(item => {
            return deleteId.indexOf(item[this.multipleSelectionProp]) === -1
          })
        }
      }
      this.multipleSelection = value
    }
  },
  beforeRouteUpdate (to, from, next) { // 监听route地址变化
    if (to.path === from.path) {
      this.query = Object.assign({}, this.$$query, to.query, {page: to.query.page || 1, rows: to.query.rows || 20})
      this.triggerFetch(this.query)
    }
    next()
  },
  updated () {
    this.handleResize()
    if (this.loading) {
      let node = this.$el.querySelector('.el-table__body-wrapper') || this.$el.querySelector('.ms-scroller')
      node && (node.scrollTop = 0)
    }
  }
}
