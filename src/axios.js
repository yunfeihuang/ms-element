import axios from 'axios'

// 创建axios实例
const $axios = axios.create({
  baseURL: '/api', // process.env.BASE_API, //api的base_url
  timeout: 10 * 1000 // 请求超时时间
})
let count = 0
$axios.interceptors.request.use(config => {
  // Do something before request is sent
  if (config.headers && sessionStorage.getItem('token')) {
    config.headers['token'] = sessionStorage.getItem('token')
  }
  // console.log('context', config.context)
  if (config.options && config.options.context) {
    if (config.options.context._isVue) { // context为vue对象则修改loading状态
      config.options.context.loading = true
      config.options.successMsg = config.options.successMsg || '提交成功'
      config.options.errorMsg = config.options.errorMsg || '提交失败'
    } else if (config.options.context.nodeType === 1) { // context为dom对象则修改disabled状态
      if (config.options.context.parentNode.disabled !== undefined) {
        config.options.context = config.options.context.parentNode
      }
      config.options.context.disabled = true
      config.options.successMsg = config.options.successMsg || '操作成功'
      config.options.errorMsg = config.options.errorMsg || '操作失败'
    }
  }
  if (/^get$/.test(config.method)) {
    window.$$loadingTimer && clearTimeout(window.$$loadingTimer)
    count++
  }
  return config
}, error => {
  // Do something with request error
  return Promise.reject(error)
})

$axios.interceptors.response.use(res => {
  if (/^(post)|(put)|(delete)$/i.test(res.config.method)) {
    // console.log('res.context', res.config.context)
    if (res.config.options && res.config.options.context) { // 是否传上下文
      if (res.config.options.context._isVue) { // context为vue对象时则修改loading状态
        res.config.options.context.loading = false
        res.config.options.context = null
      } else if (res.config.options.context.nodeType === 1) { //  context为元素对象时则修改disabled状态
        res.config.options.context.disabled = false
      }
    }
  }
  if (/^get$/.test(res.config.method)) {
    count === 1 && window.$$onComplete && window.$$onComplete()
    count--
  }
  if (res.data.code === 200) {
    return res.data
  } else if (res.data.code === 0) {
    if (location.pathname !== '/login') {
      location.href = '/login'
    }
    return Promise.reject(res.data)
  } else {
    return Promise.reject(res.data)
  }
}, error => {
  console.log('error', error)
})

export default $axios
