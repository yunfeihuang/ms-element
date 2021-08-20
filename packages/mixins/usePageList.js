import { getCurrentInstance, nextTick, onMounted, onUpdated, provide, ref } from "vue"
import { onBeforeRouteUpdate } from "vue-router"
import useFetch from "./useFetch"

export default function (props, context, _option) {
  let { proxy } = getCurrentInstance()
  let option = Object.assign({
    history: true,
    fixedTableHead: true,
    excludeValue: [null, undefined, '']
  }, _option)
  const fixedTableHead = ref(option.fixedTableHead)
  const query = option.query
  const $route = proxy.$root.$route
  if ($route.query.page) {
    $route.query.page = Number($route.query.page)
  }
  if (proxy.$root.$route.query.rows) {
    $route.query.rows = Number($route.query.rows)
  }
  const pagerQuery = {
    page: 1, 
    rows: 20
  }
  Object.assign(query, proxy.$root.$route.query)
  Object.keys(pagerQuery).forEach(key => {
    if (!query[key]) {
      query[key] = pagerQuery[key]
    }
  })
  const tableBodyHeight = ref(200)
  const filterQuery = query => {
    let result = {...query}
    for (let name in result) {
      if (option.excludeValue.includes(result[name])) {
        delete result[name]
      }
    }
    return result
  }
  const fetch = (query) => {
    if (proxy.$el && proxy.$el.parentNode) {
      let node = proxy.$el.parentNode.querySelector('.el-table__body-wrapper')
      node && (node.scrollTop = 0)
    }
    return option.fetch(query)
  }
  const updateRoute = (_query, replace) => { // 更新URL地址
    let query = filterQuery(_query)
    if (option.history) {
      if (replace) {
        proxy.$root.$router.replace({
          path: proxy.$root.$route.path,
          params: proxy.$root.$route.params,
          query
        })
      } else {
        proxy.$root.$router.push({
          path: proxy.$root.$route.path,
          params: proxy.$root.$route.params,
          query
        })
      }
    } else {
      fetch(query)
    }
  }
  const RSearch = ref(null)
  const getFormProps = props => { // 获取默认表单props
    return Object.assign({
      novalidate: 'novalidate',
      inline: true,
      size: 'small',
      ref: 'RSearch',
      model: query
    }, props)
  }
  const handleSubmit = () => {
    updateRoute.call(this, {...query, page: 1})
  }
  const RTable = ref(null)
  const getTableProps = props => { // 获取表格默认props
    return Object.assign({
      ref: 'RTable',
      height: fixedTableHead.value ? tableBodyHeight.value : undefined,
      size: 'small'
    }, props)
  }
  const indexMethod = (index) => {
    let result = (query.page - 1) * query.rows + (index + 1)
    if (result > 999) {
      return '999+'
    }
    return result
  }
  const getIndexColumnProps = () => {
    return {
      label: '序号',
      type: 'index',
      className: 'el-table-column--index',
      index: indexMethod
    }
  }
  const getPaginationProps = (props) => { // 获取分页默认props
    return Object.assign({
      pagerCount: 5,
      layout: 'total, prev, pager, next, sizes, jumper',
      background: true,
      pageSize: 20,
      currentPage: 1,
      total: 0,
      pageSizes: [10, 15, 20, 30, 40, 50, 100]
    }, {
      pageSize: query.rows ? Number(query.rows) : 20,
      currentPage: query.page ? Number(query.page) : 1
    }, props)
  }
  const handleCurrentChange = value => { // 修改页数事件
    if (value != query.page) { //eslint-disable-line
      query.page = value
      updateRoute({
        ...query,
        page: value
      })
    }
  }
  const handleSizeChange = value => { // 修改分页条数事件
    query.rows = value
    updateRoute({
      ...query,
      page: 1,
      rows: value
    })
  }
  
  const handleTab = () => {
    updateRoute.call(this, Object.assign(query, {page: 1}), true)
  }
  const handleResize = () => {
    if (fixedTableHead.value) {
      nextTick(() => {
        if (proxy.$el.parentNode) {
          const node = proxy.$el.parentNode.querySelector('.ms-page-list-layout--table')
          node && (tableBodyHeight.value = node.offsetHeight)
        }
      })
    }
  }
  const handleSelectionChange = () => {

  }
  const getTableListeners = () => {
    return {
      'selection-change': handleSelectionChange
    }
  }
  onMounted(handleResize)
  let timer = null
  onBeforeRouteUpdate(to => {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      fetch(filterQuery(to.query))
    }, 100)
  })
  onUpdated(handleResize)
  provide('msPageList', proxy)
  return {
    ...useFetch(props, context, () => {
      return fetch(query)
    }),
    query,
    fixedTableHead,
    RSearch,
    getFormProps,
    handleSubmit,
    RTable,
    getTableProps,
    getTableListeners,
    getIndexColumnProps,
    getPaginationProps,
    handleCurrentChange,
    handleSizeChange,
    filterQuery,
    fetch,
    refresh () {
      fetch(query)
    },
    handleTab,
    handleResize,
    handleSelectionChange
  }
}
