export default {
  props: {
    promiseSubmit: { // 外部提交数据
      type: Function
    }
  },
  watch: {
    loading (value) {
      this.toggleLoading(value)
    }
  },
  mounted () {
    this.createSubmitButton()
  },
  methods: {
    createSubmitButton () {
      let form = this.$el.querySelector('form')
      if (!form && /form/i.test(this.$el.nodeName)) {
        form = this.$el
      }
      if (form && !form.querySelector('button[type="submit"]')) {
        let button = document.createElement('button')
        button.type = 'submit'
        button.style.display = 'none'
        form.appendChild(button)
      }
    },
    afterSubmit () {
      !this.query && this.resetForm()
      this.$nextTick(() => {
        this.$emit('success').$emit('close')
      })
    }
  }
}
