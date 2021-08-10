import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// axios.defaults.baseURL = '/api'
axios.interceptors.request.use(config => {
  // Do something before request is sent
  if (config.headers && sessionStorage.getItem('token')) {
    config.headers['token'] = sessionStorage.getItem('token')
  }
  NProgress.start()
  return config
}, error => {
  // Do something with request error
  return Promise.reject(error)
})

axios.interceptors.response.use(res => {
  NProgress.done()
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
  NProgress.done()
  console.log('error', error)
})

export default axios
