import ElementUI from 'element-ui'

ElementUI.TableColumn.props.align = {
  type: String,
  default: 'center'
}

ElementUI.Drawer.props.willOpen = {
  type: Function
}

ElementUI.Upload.props.action = {
  type: String,
  default: '/api/v1/comm/upload-img'
}

ElementUI.Upload.props.value = {
  type: [String, Array]
}

ElementUI.DatePicker.props.startPlaceholder = {
  type: String,
  default: '开始时间'
}

ElementUI.DatePicker.props.endPlaceholder = {
  type: String,
  default: '结束时间'
}

ElementUI.DatePicker.props.placeholder = {
  type: String,
  default: '请选择时间'
}

window.$$headers = {}
ElementUI.Upload.props.headers = {
  type: Object,
  default () {
    return window.$$headers
  }
}

ElementUI.Upload.props.onSuccess = {
  type: Function,
  default (response, file, fileList) {
    if (response.code === 200) {
      fileList.forEach(item => {
        if (item.response && item.response.code === 200) {
          item.url = item.response.data
        }
      })
      let value = {name: file.name, url: response.data}
      if (this.listType === 'picture-card') {
        value = fileList.map(item => item.url)
      } else if (this.listType === 'picture') {
        value = response.data
      } else if (this.listType === 'text' && this.limit !== 1) {
        value = fileList.map(item => {
          return {
            name: item.name,
            url: item.url
          }
        })
      }
      this.$emit('input', value).$emit('change', value)
    } else {
      fileList.splice(fileList.indexOf(file), 1)
      ElementUI.Message({
        type: 'error',
        message: response.msg
      })
    }
  }
}

ElementUI.Upload.props.onRemove = {
  type: Function,
  default (file, fileList) {
    let value = ''
    if (this.listType === 'picture-card') {
      value = fileList.map(item => item.url)
    }
    this.$emit('input', value).$emit('change', value)
  }
}

export default ElementUI
