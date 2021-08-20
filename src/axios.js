import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// axios.defaults.baseURL = '/api'
axios.interceptors.request.use(config => {
  // Do something before request is sent
  if (config.headers && localStorage.getItem('token')) {
    config.headers['token'] = localStorage.getItem('token')
  }
  NProgress.start()
  return config
}, error => {
  // Do something with request error
  return Promise.reject(error)
})

axios.interceptors.response.use(res => {
  NProgress.done()
  if (res.config.responseType === 'blob') {
    let blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=utf-8'}) // 创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
    let fileName = decodeURI(res.headers['content-disposition']) // 设置文件名称,decodeURI：可以对后端使用encodeURI() 函数编码过的 URI 进行解码。encodeURI() 是后端为了解决中文乱码问题
    if (fileName) { // 根据后端返回的数据处理文件名称
      fileName = fileName.substring(fileName.indexOf('=') + 1)
    }
    const link = document.createElement('a') // 创建一个a标签
    link.download = fileName // 设置a标签的下载属性
    link.style.display = 'none' // 将a标签设置为隐藏
    link.href = URL.createObjectURL(blob) // 把之前处理好的地址赋给a标签的href
    document.body.appendChild(link) // 将a标签添加到body中
    link.click() // 执行a标签的点击方法
    URL.revokeObjectURL(link.href) // 下载完成释放URL 对象
    document.body.removeChild(link) // 移除a标签
    return res.data
  } else {
    if (res.data.code === 200) {
      return res.data
    } else if (res.data.code === 400) {
      if (window.$app.$route.path !== '/signin') {
        window.$app.$router.push({
          path: '/signin'
        })
      }
      return Promise.reject(res.data)
    } else {
      window.$app.$message({
        message: res.data.msg,
        type: 'error'
      })
      return Promise.reject(res.data)
    }
}
}, error => {
  NProgress.done()
  console.log('error', error)
})

export default axios
