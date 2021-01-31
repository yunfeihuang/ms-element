'use strict'
import validator from '@/utils/validator'
import fetch from './fetch'

export default {
  mixins: [fetch],
  props: {
    promiseSubmit: {
      type: Function
    }
  },
  data () {
    return {
      validator,
      posting: false,
      form: {}
    }
  },
  watch: {
    posting (value) {
      this.$emit('posting', value)
    }
  },
  methods: {
    getFormProps (props) { // 获取el-form表单props
      return Object.assign({
        ref: 'form',
        model: this.form,
        labelWidth: '6.66rem',
        novalidate: 'novalidate',
        class: 'form-default',
        size: 'small'
      }, props)
    },
    validate (cb) { // 表单校验
      if (this.$refs.form && this.$refs.form.validate) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (cb) {
              cb()
            } else {
              this.beforeSubmit && this.beforeSubmit()
            }
          } else {
            this.validateFail()
            return false
          }
        })
      }
    },
    beforeSubmit () {
      if (!this.posting) {
        if (this.promiseSubmit) {
          let promise = this.promiseSubmit(JSON.parse(JSON.stringify(this.form)))
          if (promise && promise.then) {
            this.posting = true
            promise.then(res => {
              this.posting = false
              this.afterSubmit && this.afterSubmit(res)
              return res
            }).catch(err => {
              this.posting = false
              return err
            })
          }
        } else if (this.submit) {
          let promise = this.submit()
          if (promise && promise.then) {
            this.posting = true
            promise.then(res => {
              this.posting = false
              this.afterSubmit && this.afterSubmit(res)
              return res
            }).catch(err => {
              this.posting = false
              return err
            })
          }
        }
      }
    },
    afterSubmit () { // 提交成功后处理
      if (this.done) {
        this.done()
      } else {
        history.back()
      }
    },
    validateFail () { // 出现错误滚动到首个错误输入框并聚焦
      this.$nextTick(() => {
        let node = this.$el.querySelector('.is-error')
        if (node) {
          if (node.scrollIntoView) {
            let rect = node.getBoundingClientRect()
            if (rect.top < 0) {
              node.scrollIntoView(true)
            }
          }
          let inputs = node.querySelectorAll('input,textarea')
          inputs && inputs.length === 1 && inputs[0].focus()
        }
      })
    },
    parseResponse (res) {
      res && this.assignFormData(res)
      return res
    },
    assignFormData (data) { // 合并请示返回的数据到表单form
      Object.keys(this.form).forEach(item => {
        this.form[item] = data[item]
      })
    },
    submit () { // 提交数据
      return new Promise((resolve) => {
        setTimeout(resolve, 1000)
      })
    },
    handleSubmit () { // 提交表单事件
      this.validate()
    },
    handleReset () {
      this.resetForm()
    },
    resetForm () { // 重置表单
      this.$refs.form && this.$refs.form.resetFields()
    },
    handleDateRangeInput (value, keys = ['start_time', 'end_time']) {
      if (value && value[0]) {
        this.form[keys[0]] = value[0]
        this.form[keys[1]] = value[1]
      } else {
        keys.forEach(item => {
          this.form[item] = null
        })
      }
    }
  }
}
