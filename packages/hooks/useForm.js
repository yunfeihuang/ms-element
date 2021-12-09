import { ref, watch} from 'vue'
import useFetch from './useFetch'

export default function (props, context) {
  const RForm = ref(null)
  const posting = ref(false)
  watch(posting, val => {
    context.emit('posting', val)
  })
  const beforeSubmit = function (submit) {
    let self = this
    const form = {...this.form}
    submit && submit(this.getFormData ? this.getFormData() : form).then(res => {
      const cb = () => {
        context.emit('close')
      }
      if (props.done) {
        props.done(cb, res, form)
      } else if (self.done){
        self.done(cb, res, form)
      } else {
        cb()
      }
    }).finally(() => {
      posting.value = false
    })
  }
  const validateFail = function () { // 出现错误滚动到首个错误输入框并聚焦
    let node = RForm.value.$el.querySelector('.is-error')
    if (node) {
      if (node.scrollIntoView) {
        let rect = node.getBoundingClientRect()
        if (rect.top < 0) {
          node.scrollIntoView({behavior: 'smooth'})
        }
      }
    }
  }
  
  const validate = function(submit) {
    posting.value = true
    let self = this
    RForm.value.validate(valid => {
      if (valid) {
        if (submit && typeof submit == 'function') {
          self.beforeSubmit ? self.beforeSubmit(submit) : beforeSubmit.call(self, submit)
        } else if (props.promiseSubmit) {
          self.beforeSubmit ? self.beforeSubmit(props.promiseSubmit) :beforeSubmit.call(self, props.promiseSubmit)
        } else if (self.submit) {
          self.beforeSubmit ? self.beforeSubmit(self.submit) : beforeSubmit.call(self, self.submit)
        } else {
          console.log('submit method null found')
        }
      } else {
        posting.value = false
        validateFail()
        self.validateError && self.validateError()
      }
    })
  }
  const handleSubmit = function (submit) {
    if (this.validate) {
      this.validate(submit, validate)
    } else {
      validate.call(this, submit)
    }
  }
  const handleReset = function () {
    RForm.value && RForm.value.resetFields()
  }
  const mergeForm = function (data) {
    if (data && typeof data === 'object') {
      Object.keys(this.form).forEach(key => {
        this.form[key] = data[key]
      })
    }
  }
  const getFormProps = function (props) {
    return Object.assign({
      ref: 'RForm',
      model: this.form,
      labelWidth: '100px',
      size: this.getSize ? this.getSize() : undefined,
    }, props)
  }
  return {
    ...useFetch(props, context),
    posting,
    RForm,
    mergeForm,
    getFormProps,
    beforeSubmit,
    validateFail,
    handleSubmit,
    handleReset
  }
}
