import _axios from 'axios'

/*
* 参考 https://www.npmjs.com/package/restful-api
*/
export default (rootUrl, axios = _axios) => {
  return {
    fetch (option) {
      let {url, ...other} = option
      return axios({
        url: url ? rootUrl + url : rootUrl,
        ...other
      })
    },
    get (option) { // 获取列表数据或者单条数据
      let {url, ...other} = option
      return axios({
        url: url ? rootUrl + url : rootUrl,
        ...other
      })
    },
    post (option) { // 创建数据
      return this.fetch({
        method: 'POST',
        ...option
      })
    },
    put (option) { // 更新全量数据
      return this.fetch({
        method: 'PUT',
        ...option
      })
    },
    delete (option) { // 删除数据
      return this.fetch({
        method: 'DELETE',
        ...option
      })
    },
    patch (option) { // 更新部分数据
      return this.fetch({
        method: 'PATCH',
        ...option
      })
    },
    batch (option) { // 批量操作
      let {url, ...other} = option
      return this.fetch({
        url: url ? '/batch' + url : '/batch',
        method: 'POST',
        ...other
      })
    },
    export (option, fileName) { // 获取列表数据或者单条数据
      let {url, ...other} = option
      return axios({
        url: url ? rootUrl + '/export' + url : rootUrl + '/export',
        responseType: 'blob',
        ...other
      }).then(res => {
        if (option.responseType === 'blob') {
          let blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=utf-8'}) // 创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
          if (!fileName) {
            let fileName = decodeURI(res.headers['content-disposition']) // 设置文件名称,decodeURI：可以对后端使用encodeURI() 函数编码过的 URI 进行解码。encodeURI() 是后端为了解决中文乱码问题
            if (fileName) { // 根据后端返回的数据处理文件名称
              fileName = fileName.substring(fileName.indexOf('=') + 1)
            }
          }
          const link = document.createElement('a') // 创建一个a标签
          link.download = fileName // 设置a标签的下载属性
          link.style.display = 'none' // 将a标签设置为隐藏
          link.href = URL.createObjectURL(blob) // 把之前处理好的地址赋给a标签的href
          document.body.appendChild(link) // 将a标签添加到body中
          link.click() // 执行a标签的点击方法
          URL.revokeObjectURL(link.href) // 下载完成释放URL 对象
          document.body.removeChild(link) // 移除a标签
        }
        return res
      })
    }
  }
}
