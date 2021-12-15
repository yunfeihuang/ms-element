import { nextTick, onMounted, onUpdated, provide, ref, onUnmounted, getCurrentInstance, h, resolveComponent} from "vue"
import { onBeforeRouteUpdate } from "vue-router"
import useFetch from "./useFetch"

export default function (props, context) {
  let { proxy } = getCurrentInstance()
  const {beforeFetch, ...other } = useFetch(props, context)
  let isRouterView = false
  const tableBodyHeight = ref(200)
  const multipleSelectionAll = ref([])
  const multipleSelection = ref([])
  let idKey = ''
  const defaultQuery = {
    page: 1, 
    rows: 20
  }
  const createQuery = query => {
    let result = defaultQuery
    props && props.params && Object.assign(result, props.params)
    query && Object.assign(result, query)
    return result
  }
  const filterQuery = query => {
    let result = {...query}
    for (let name in result) {
      if ((proxy.excludeValue || [null, undefined, '']).includes(result[name])) {
        delete result[name]
      }
    }
    return result
  }
  const scrollTop = function () {
    if (proxy.$el && proxy.$el.parentNode) {
      let node = proxy.$el.parentNode.querySelector('.el-table__body-wrapper')
      node && (node.scrollTop = 0)
    }
  }
  const beforeFetch2 = () => {
    proxy.scrollTop && proxy.scrollTop()
    return beforeFetch.call(proxy, proxy.query)
  }
  const updateRoute = (_query, replace) => { // 更新URL地址
    let query = filterQuery(_query)
    if (isRouterView) {
      proxy.$root.$router[replace ? 'replace' : 'push']({
        path: proxy.$root.$route.path,
        params: proxy.$root.$route.params,
        query
      })
    } else {
      proxy.beforeFetch && proxy.beforeFetch(query)
    }
  }
  const RSearch = ref(null)
  const getFormProps = props => { // 获取默认表单props
    return Object.assign({
      novalidate: 'novalidate',
      inline: true,
      size: this.getSize ? this.getSize(800) : undefined,
      ref: 'RSearch',
      model: proxy ? proxy.query : null
    }, props)
  }
  const handleReset = () => {
    proxy.$refs.RSearch && proxy.$refs.RSearch.handleReset && proxy.$refs.RSearch.handleReset()
  }
  const handleSubmit = () => {
    updateRoute.call(proxy, {...proxy.query, page: 1})
  }
  const RTable = ref(null)
  const getTableProps = props => { // 获取表格默认props
    return Object.assign({
      ref: 'RTable',
      height: proxy && proxy.fixedTableHead !== false ? tableBodyHeight.value : undefined,
      size: proxy.getSize ? proxy.getSize() : undefined,
      defaultSort: proxy.query && proxy.query.sort_order ? {
        prop: proxy.query.sort_prop, 
        order: proxy.query.sort_order
      } : {}
    }, props)
  }
  const indexMethod = (index) => {
    let result = (proxy.query.page - 1) * proxy.query.rows + (index + 1)
    if (result > 999) {
      return '999+'
    }
    return result
  }
  const getIndexColumnProps = (props) => {
    return {
      label: '#',
      type: 'index',
      className: 'el-table-column--index',
      index: indexMethod,
      ...props
    }
  }
  const getSelectionProps = (props, _idKey = 'id') => {
    idKey = _idKey
    return {
      type: 'selection',
      width: 58,
      ...props
    }
  }
  const getPaginationProps = (props) => { // 获取分页默认props
    return Object.assign({
      pagerCount: 5,
      layout: 'total, prev, pager, next, sizes, jumper',
      background: true,
      pageSize: 20,
      currentPage: 1,
      total: proxy && proxy.response ? proxy.response.total : 0,
      pageSizes: [10, 15, 20, 30, 40, 50, 100]
    }, {
      pageSize: proxy && proxy.query.rows ? Number(proxy.query.rows) : 20,
      currentPage: proxy && proxy.query.page ? Number(proxy.query.page) : 1
    }, props)
  }
  const handleCurrentChange = value => { // 修改页数事件
    if (value != proxy.query.page) { //eslint-disable-line
      proxy.query.page = value
      updateRoute({
        ...proxy.query,
        page: value
      })
    }
  }
  const handleSizeChange = value => { // 修改分页条数事件
    proxy.query.rows = value
    updateRoute({
      ...proxy.query,
      page: 1,
      rows: value
    })
  }
  
  const handleTab = () => {
    updateRoute.call(proxy, Object.assign(proxy.query, {page: 1}), true)
  }
  const handleResize = () => {
    if (proxy.fixedTableHead !== false) {
      nextTick(() => {
        const node = proxy.$el.parentNode.querySelector('.ms-page-list-layout--table')
        if (proxy.$el.parentNode && node) {
          node && (tableBodyHeight.value = node.offsetHeight)
        }
      })
    }
  }
  const handleSelectionChange = (selection) => {
    multipleSelection.value = selection
    if (idKey) {
      let unSelection = []
      let ids = []
      if (selection.length) {
        selection.forEach(item => {
          ids.push(item[idKey])
          if (!multipleSelectionAll.value.some(item2 => item2[idKey] == item[idKey])) {
            multipleSelectionAll.value.push(item)
          }
        })
        if (proxy.response && proxy.response.data) {
          unSelection = proxy.response.data.filter(item => !ids.includes(item[idKey]))
        }
      } else {
        if (proxy.response && proxy.response.data) {
          unSelection = proxy.response.data
        }
      }
      unSelection.forEach(item => {
        multipleSelectionAll.value = multipleSelectionAll.value.filter(item2 => item2[idKey] != item[idKey])
      })
    }
  }
  
  const handleClearSelection = () => {
    multipleSelection.value = multipleSelectionAll.value = []
    proxy.$refs.RTable.clearSelection()
  }
  const handleSortChange = ({prop, order}) => {
    proxy.query.page = 1
    if (order) {
      proxy.query.sort_prop = prop
      proxy.query.sort_order = order
    } else {
      delete proxy.query.sort_prop
      delete proxy.query.sort_order
    }
    updateRoute.call(proxy, proxy.query)
  }
  const getTableListeners = () => {
    return {
      'selection-change': handleSelectionChange,
      'sort-change': handleSortChange
    }
  }

  const includesProp = function (prop) {
    let self = proxy
    if (self.column && self.column.length) {
      return self.column.some(item => item.prop == prop && item.show)
    }
    return true
  }
  const handleColumnSetting = () => {
    let self = proxy
    if (self.column && self.column.length) {
      self.$navigator.push(self, {
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
        params: self.column,
        size: 'mini',
        resetText: '',
        promiseSubmit (form) {
          self.column = form
          return Promise.resolve()
        }
      })
    }
  }
  
  onMounted(() => {
    if (proxy.$parent && proxy.$parent.$options && proxy.$parent.$options.name && ['keepalive', 'routerview'].includes(proxy.$parent.$options.name.toLocaleLowerCase())) {
      isRouterView = true
    }
    window.addEventListener('resize', handleResize)
    handleResize()
  })
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
  let timer = null
  onBeforeRouteUpdate(to => {
    if (proxy.beforeFetch) {
      timer && clearTimeout(timer)
      timer = setTimeout(() => {
        proxy.beforeFetch(filterQuery(to.query)).then(res => {
          if (multipleSelectionAll.value.length) {
            let ids = multipleSelectionAll.value.map(item => item[idKey])
            res.data.forEach((row) => {
              ids.includes(row[idKey]) && proxy.$refs.RTable.toggleRowSelection(row)
            })
          }
          return res
        })
      }, 100)
    }
  })
  
  onUpdated(handleResize)
  provide('msPageList', proxy)
  return {
    ...other,
    idKey,
    defaultQuery,
    createQuery,
    beforeFetch: beforeFetch2,
    scrollTop,
    RSearch,
    getFormProps,
    handleSubmit,
    handleReset,
    RTable,
    getTableProps,
    getTableListeners,
    getIndexColumnProps,
    getSelectionProps,
    getPaginationProps,
    handleCurrentChange,
    handleSizeChange,
    filterQuery,
    handleTab,
    handleResize,
    multipleSelection,
    multipleSelectionAll,
    handleSelectionChange,
    handleClearSelection,
    includesProp,
    handleColumnSetting
  }
}
