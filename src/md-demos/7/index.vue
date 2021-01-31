<template>
  <el-input v-bind="$props" v-on="listeners"></el-input>
</template>
<script>
import {Input} from 'element-ui'
export default {
  props: {
    ...Input.props,
    placeholder: {
      type: String,
      default: '请输入帐号'
    }
  },
  computed: {
    listeners () {
      return {
        ...this.$listeners,
        change: this.handleChange
      }
    }
  },
  methods: {
    handleChange (value) {
      console.log('overwrite change')
      this.$emit('change', value)
    }
  }
}
</script>
