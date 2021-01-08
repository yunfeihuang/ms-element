import validator from '@/utils/validator'

export default {
  data () {
    return {
      loading: false,
      validator
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
      if (this.promiseSubmit) {
        let promise = this.promiseSubmit(JSON.parse(JSON.stringify(this.form)))
        if (promise && promise.then) {
          this.loading = true
          promise.then(() => {
            this.loading = false
            this.afterSubmit && this.afterSubmit()
          }).catch(() => {
            this.loading = false
          })
        }
      } else if (this.submit) {
        let promise = this.submit()
        if (promise && promise.then) {
          this.loading = true
          promise.then(() => {
            this.loading = false
            this.afterSubmit && this.afterSubmit()
          }).catch(() => {
            this.loading = false
          })
        }
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
    submit () { // 提交数据
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
