import { getCurrentInstance, nextTick, onMounted, onUpdated, provide, ref, onUnmounted } from "vue"
import { onBeforeRouteUpdate} from "vue-router"
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
    this.params && Object.assign(result, this.params)
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
  const beforeFetch2 = () => {
    if (proxy.$el && proxy.$el.parentNode) {
      let node = proxy.$el.parentNode.querySelector('.el-table__body-wrapper')
      node && (node.scrollTop = 0)
    }
    return beforeFetch(proxy.query)
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
      size: 'small',
      ref: 'RSearch',
      model: proxy.query
    }, props)
  }
  const handleSubmit = () => {
    updateRoute.call(this, {...proxy.query, page: 1})
  }
  const RTable = ref(null)
  const getTableProps = props => { // 获取表格默认props
    return Object.assign({
      ref: 'RTable',
      height: proxy.fixedTableHead !== false ? tableBodyHeight.value : undefined,
      size: 'small'
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
      width: 58
    }
  }
  const getPaginationProps = (props) => { // 获取分页默认props
    return Object.assign({
      pagerCount: 5,
      layout: 'total, prev, pager, next, sizes, jumper',
      background: true,
      pageSize: 20,
      currentPage: 1,
      total: proxy.response ? proxy.response.total : 0,
      pageSizes: [10, 15, 20, 30, 40, 50, 100]
    }, {
      pageSize: proxy.query.rows ? Number(proxy.query.rows) : 20,
      currentPage: proxy.query.page ? Number(proxy.query.page) : 1
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
    updateRoute.call(this, Object.assign(proxy.query, {page: 1}), true)
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
    console.log('handleSelectionChange')
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
        unSelection = proxy.response.data.filter(item => !ids.includes(item[idKey]))
      } else {
        unSelection = proxy.response.data
      }
      unSelection.forEach(item => {
        // multipleSelectionAll.value = multipleSelectionAll.value.filter(item2 => item2[idKey] != item[idKey])
      })
    }
    console.log('selection', selection)
  }
  const getTableListeners = () => {
    return {
      'selection-change': handleSelectionChange
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
    multipleSelection,
    multipleSelectionAll,
    beforeFetch: beforeFetch2,
    RSearch,
    getFormProps,
    handleSubmit,
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
    handleSelectionChange
  }
}
