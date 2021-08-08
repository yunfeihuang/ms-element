const utils = require('../utils')
module.exports = function (designer) {
  const renderChildren = function (item) {
    let tag = ''
    if (item.component === 'el-select') {
      tag = 'el-option'
    }
    if (item.component === 'el-checkbox-group') {
      tag = 'el-checkbox'
    }
    if (item.component === 'el-radio-group') {
      tag = 'el-radio'
    }
    if (item.slots && item.slots.length) {
      return `\n${item.slots.map(item => {
        return `<${tag} ${utils.objectToProps(item)}></${tag}>`
      }).join('\n')}\n`
    }else{
      return ''
    }
  } 
  return `
<template>
  <el-form v-bind="getFormProps()" @submit.native.prevent="handleSubmit">
    ${designer.form.option.map(function (item) {
      return `<el-form-item label="${item.label}" prop="${item.prop}" ${item.rules && item.rules.length ? `:rules="${utils.arrayToValue(item.rules)}"` : ''}>
      <${item.component} v-model="form.${item.prop}" ${item.props ? utils.objectToProps(item.props) : ''}>${renderChildren(item)}</${item.component}>
    </el-form-item>`
    }).join('\n')}
  </el-form>
</template>

<script>
const api = ms.restful('${designer.setting.restfulApi}')
export default {
  mixins: [
    ms.mixins.form
  ],
  data () {
    return {
      form: { // 必须使用form来绑定表单数据,需要在里面声明属性，获取数据后才会更新上去
        ${designer.form.option.map(item => {
          return `${item.prop}: null`
        }).join(',\n')}
      }
    }
  },
  methods: {
    fetch () {
      if (this.params && this.params.${designer.setting.idProp}) {
        return api.get({url: '/' + this.params.${designer.setting.idProp}})
      }
      // return Promise.resolve(this.params) // 参数做为表单编辑数据
    },
    submit () { // 表单校验通过后调用的方法，一般是请求后台接口的方法
      if (this.params && this.params.${designer.setting.idProp}) { // 更新
        return api.put({url: '/' + this.params.${designer.setting.idProp} , data: this.form})
      } else {
        return api.post({data: this.form}) // 创建
      }
    }
  }
}
</script>
  `
}