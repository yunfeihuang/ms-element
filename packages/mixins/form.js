'use strict'
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
      posting: false,
      form: {}
    }
  },
  watch: {
    posting (value) {
      this.$emit('posting', value)
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.isRouterView = true
    })
  },
  updated () {
    if (this.msDrawer) {
      let form = this.$el.tagName.toLocaleLowerCase() === 'form' ? this.$el : this.$el.querySelector('form')
      if (form) {
        let node = form.querySelector('button[type="submit"]')
        if (!node) {
          let button = document.createElement('button')
          button.type = 'submit'
          button.style.display = 'none'
          form.appendChild(button)
        }
      }
    }
  },
  methods: {
    getFormProps (props) { // 获取el-form表单props
      return Object.assign({
        ref: 'form',
        model: this.form,
        labelWidth: '6.66rem',
        novalidate: 'novalidate',
        class: 'ms-form-default',
        size: this.getSize ? this.getSize() : undefined
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
    getFormData () {
      return {
        ...this.form
      }
    },
    beforeSubmit () {
      if (!this.posting) {
        if (this.promiseSubmit) {
          let promise = this.promiseSubmit(JSON.parse(JSON.stringify(this.getFormData())))
          if (promise && promise.then) {
            this.posting = true
            promise.then(res => {
              this.afterSubmit && this.afterSubmit(res)
              return res
            }).finally(() => {
              this.posting = false
            })
          }
        } else if (this.submit) {
          let promise = this.submit()
          if (promise && promise.then) {
            this.posting = true
            promise.then(res => {
              this.afterSubmit && this.afterSubmit(res)
              return res
            }).finally(() => {
              this.posting = false
            })
          }
        }
      }
    },
    afterSubmit (res) { // 提交成功后处理
      if (this.done) {
        const cb = () => {
          this.$emit('close')
        }
        this.done(cb.bind(this), res)
      } else if (this.isRouterView) {
        this.isRouterView && history.back()
      } else {
        this.$emit('close')
      }
    },
    validateFail () { // 出现错误滚动到首个错误输入框并聚焦
      this.$nextTick(() => {
        let node = this.$el.querySelector('.is-error')
        if (node) {
          if (node.scrollIntoView) {
            let rect = node.getBoundingClientRect()
            if (rect.top < 0) {
              node.scrollIntoView({behavior: 'smooth'})
            }
          }
        }
      })
    },
    mergeForm (data) { // 合并请示返回的数据到表单form
      Object.keys(this.form).forEach(item => {
        if (data[item]) {
          this.form[item] = data[item]
        }
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
    handleArrayChange (value, keys = ['start_time', 'end_time']) {
      if (value && value.length) {
        keys.forEach((item, index) => {
          this.form[item] = value[index]
        })
      } else {
        keys.forEach(item => {
          this.form[item] = null
        })
      }
    }
  }
}
