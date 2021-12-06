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
      idKey: 'id',
      multipleSelectionAll: [], // 全部选中的数据
      multipleSelection: [], // 当前页选中的数据
      tableBodyHeight: 200,
      defaultQuery: {
        page: 1,
        rows: 20
      }
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
        this.beforeFetch && this.beforeFetch(query)
      })
    },
    fetch (query) { // 需要被重写并返回Promise， 初始化会执行，路由参数变化也会执行
      console.log(query)
    },
    parseResponse (res) {
      let result = res
      const fn = (obj) => {
        let keys = Object.keys(obj)
        if (keys.includes('total') && keys.includes('data')) {
          result = obj
        } else if (obj.data) {
          fn(obj.data)
        }
      }
      fn(res)
      return result
    },
    getSelectionProps (props, _idKey = 'id') {
      this.idKey = _idKey
      return {
        type: 'selection',
        width: 58,
        ...props
      }
    },
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
    createQuery (query) { // 获取请求参数
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
      return Object.assign(this.defaultQuery, this.params || {}, this.$route && this.isHistory ? this.$route.query : {}, query)
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
    getPaginationProps () { // 获取分页默认props
      let props = {
        pagerCount: 5,
        layout: 'total, prev, pager, next, sizes, jumper',
        background: true,
        pageSize: 20,
        currentPage: 1,
        total: 0,
        pageSizes: [10, 15, 20, 30, 40, 50, 100]
      }
      if (this.query) {
        let query = this.query
        let rows = query.rows ? Number(query.rows) : 20
        let page = query.page ? Number(query.page) : 1
        Object.assign(props, {
          pageSize: rows,
          currentPage: page
        })
      }
      return props
    },
    getTableProps (props) { // 获取表格默认props
      return Object.assign({
        ref: 'table',
        class: 'table-primary',
        height: !this.fixedTableHead ? undefined : this.tableBodyHeight
      }, props)
    },
    getTableListeners () {
      return {
        'selection-change': this.handleSelectionChange,
        'sort-change': this.handleSortChange
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
    handleTab () {
      let query = this.queryFilter(Object.assign(this.query, {page: 1}))
      if (this.isHistory) {
        this.$router.replace({
          path: this.$route.path,
          query
        })
      } else {
        this.query = query
        this.triggerFetch(query)
      }
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
        if (this.fixedTableHead && this.$el && this.$el.parentNode && this.$el.parentNode.querySelector) {
          let node = this.$el.parentNode.querySelector('.ms-page-list-layout--table')
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
    handleSubmit (e) { // 表单提交事件
      e.preventDefault()
      this.query.page = 1
      this.updateRoute(this.query)
    },
    handleReset () {
      this.query = Object.assign(this.defaultQuery, this.$$query)
      // this.triggerFetch(this.query)
      this.$refs.search && this.$refs.search.resetFields && this.$refs.search.resetFields()
    },
    handleSortChange ({prop, order }) {
      this.query.page = 1
      if (order) {
        this.query.sort_prop = prop
        this.query.sort_order = order
      } else {
        delete this.query.sort_prop
        delete this.query.sort_order
      }
      this.updateRoute(this.query)
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
      this.query = Object.assign({}, this.$$query, to.query)
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
