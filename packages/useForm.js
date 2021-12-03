'use strict'
import { inject, ref, watch } from 'vue'
import useFetch from './useFetch'

export default function (props, context, option) {
  const RForm = ref(null)
  const posting = ref(false)
  const msDrawer = inject('msDrawer')
  watch(posting.value, val => {
    msDrawer && context.emit('posting', val)
  })
  const form = option.form
  const beforeSubmit = (submit) => {
    submit(form).then(res => {
      const cb = () => {
        msDrawer && msDrawer.handleClose()
      }
      if (props.done) {
        props.done(cb, res, form)
      } else if (option.done){
        option.done(cb, res, form)
      } else {
        cb()
      }
    }).finally(() => {
      posting.value = false
    })
  }
  const validateFail = () => { // 出现错误滚动到首个错误输入框并聚焦
    let node = RForm.value.$el.querySelector('.is-error')
    if (node) {
      if (node.scrollIntoView) {
        let rect = node.getBoundingClientRect()
        if (rect.top < 0) {
          node.scrollIntoView({behavior: 'smooth'})
        }
      }
      let inputs = node.querySelectorAll('input,textarea')
      inputs && inputs.length === 1 && inputs[0].focus()
    }
  }
  const handleSubmit = (submit) => {
    posting.value = true
    RForm.value.validate(valid => {
      if (valid) {
        if (submit) {
          beforeSubmit(submit)
        } else if (props.promiseSubmit) {
          beforeSubmit(props.promiseSubmit)
        } else if (option.submit) {
          beforeSubmit(option.submit)
        } else {
          console.log('submit method null found')
        }
      } else {
        posting.value = false
        validateFail()
        option.validateError && option.validateError()
      }
    })
  }
  const handleReset = () => {
    RForm.value && RForm.value.resetFields()
  }
  const mergeForm = (data) => {
    if (data && typeof data === 'object') {
      Object.keys(form).forEach(key => {
        form[key] = data[key]
      })
    }
  }
  return {
    ...useFetch(props, context),
    posting,
    form,
    RForm,
    mergeForm,
    fetchDone (res) {
      mergeForm(res)
      return res
    },
    getFormProps (props) {
      return Object.assign({
        ref: 'RForm',
        model: form,
        labelWidth: '100px'
      }, props)
    },
    beforeSubmit,
    validateFail,
    handleSubmit,
    handleReset
  }
}
