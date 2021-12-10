import {h, resolveComponent} from 'vue'
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
    defaultQuery: {
      default () {
        return {
          page: 1,
          rows: 20
        }
      }
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
      tableBodyHeight: 200
    }
  },
  watch: {
    $route: {
      handler (value, oldValue) {
        if (this.isRouterView && oldValue && oldValue.path == value.path) {
          this.query = Object.assign({}, value.query)
          this.triggerFetch(this.query)
        }
      },
      deep: true
    },
    response (value) { // 监听response更新列表选中的数据
      this.$nextTick(() => {
        const idKey = this.idKey
        if (this.multipleSelectionAll.length && value && value.data && value.data.length) {
          let ids = this.multipleSelectionAll.map(item => item[idKey])
          value.data.forEach((row) => {
            ids.includes(row[idKey]) && this.$refs.table.toggleRowSelection(row)
          })
        }
      })
    }
  },
  mounted () {
    if (this.$parent && this.$parent.$options && this.$parent.$options.name && ['keepalive', 'routerview'].includes(this.$parent.$options.name.toLocaleLowerCase())) {
      this.isRouterView = true
    }
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
    /*
    fetch (query) { // 需要被重写并返回Promise， 初始化会执行，路由参数变化也会执行
      console.log(query)
    },
    */
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
    getSelectionProps (props, idKey) {
      if (idKey) {
        this.idKey = idKey
      }
      return {
        type: 'selection',
        width: 58,
        ...props
      }
    },
    getIndexColumnProps (props) {
      return {
        label: '序号',
        type: 'index',
        className: 'el-table-column--index',
        index: this.indexMethod,
        ...props
      }
    },
    indexMethod (index) {
      let result = (Number(this.query.page) - 1) * Number(this.query.rows) + (index + 1)
      if (result > 999) {
        return '999+'
      }
      return result
    },
    createQuery (query = {}) { // 获取请求参数
      if (this.params) {
        Object.keys(this.params).forEach(key => {
          if (!query[key]) {
            query[key] = this.params[key]
          }
        })
      }
      return Object.assign(this.defaultQuery, query)
    },
    queryFilter (query) {
      let result = {...query}
      for (let name in result) {
        if (['page', 'rows'].includes(name)){
          result[name] = Number(result[name])
        }
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
        total: this.response ? this.response.total : 0,
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
        size: this.getSize ? this.getSize() : undefined,
        height: !this.fixedTableHead ? undefined : this.tableBodyHeight,
        defaultSort: this.query && this.query.sort_order ? {
          prop: this.query.sort_prop, 
          order: this.query.sort_order
        } : {}
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
        size: this.getSize ? this.getSize(800) : undefined,
        ref: 'search',
        model: this.query
      }, props)
    },
    handleTab () {
      let query = this.queryFilter(Object.assign(this.query, {page: 1}))
      if (this.isRouterView) {
        this.$router.replace({
          path: this.$route.path,
          query
        })
      } else {
        this.query = this.queryFilter(query)
        this.triggerFetch({...this.query})
      }
    },
    handleArrayChange (value, keys = ['start_time', 'end_time']) {
      if (value && value.length) {
        keys.forEach((item, index) => {
          this.query[item] = value[index]
        })
      } else {
        keys.forEach(item => {
          this.query[item] = null
        })
      }
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
      query = this.queryFilter(query)
      if (this.isRouterView) {
        this.$router.push({path: this.$route.path, query})
      } else {
        this.query = query
        this.triggerFetch({...query})
      }
    },
    handleSubmit (e) { // 表单提交事件
      e.preventDefault()
      this.query.page = 1
      this.updateRoute(this.query)
    },
    handleReset () {
      // this.triggerFetch(this.query)
      this.$refs.search && this.$refs.search.handleReset && this.$refs.search.handleReset()
    },
    handleSortChange ({prop, order}) {
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
    handleClearSelection () {
      this.$refs.table && this.$refs.table.clearSelection && this.$refs.table.clearSelection()
      this.multipleSelection = this.multipleSelectionAll = []
    },
    handleSelectionChange (selection) {
      this.multipleSelection = selection
      const idKey = this.idKey
      if (idKey) {
        let unSelection = []
        let ids = []
        if (selection.length) {
          selection.forEach(item => {
            ids.push(item[idKey])
            if (!this.multipleSelectionAll.some(item2 => item2[idKey] == item[idKey])) {
              this.multipleSelectionAll.push(item)
            }
          })
          if (this.response && this.response.data) {
            unSelection = this.response.data.filter(item => !ids.includes(item[idKey]))
          }
        } else {
          if (this.response && this.response.data) {
            unSelection = this.response.data
          }
        }
        unSelection.forEach(item => {
          this.multipleSelectionAll = this.multipleSelectionAll.filter(item2 => item2[idKey] != item[idKey])
        })
      }
    },
    handleColumnSetting () {
      let self = this
      if (this.column && this.column.length) {
        this.$navigator.push(this, {
          render () {
            return h('div', {}, this.form.map(item => {
              return h(resolveComponent('ElCheckbox'), {
                checked: item.show,
                style: 'display:block;margin-bottom:10px;',
                onChange (value) {
                  item.show = value
                }
              }, item.label)
            }))
          },
          data () {
            return {
              form: JSON.parse(JSON.stringify(this.params))
            }
          },
          methods: {
            handleSubmit () {
              if (this.promiseSubmit) {
                this.promiseSubmit(this.form).then(() => {
                  this.$emit('close')
                })
              }
            }
          }
        } , {
          title: '表格列显示',
          params: this.column,
          size: 'mini',
          resetText: '',
          promiseSubmit (form) {
            self.column = form
            return Promise.resolve()
          }
        })
      }
    }
  },
  updated () {
    this.handleResize()
    if (this.loading) {
      let node = this.$el.querySelector('.el-table__body-wrapper') || this.$el.querySelector('.ms-scroller')
      node && (node.scrollTop = 0)
    }
  }
}
