<template>
  <div>
   props.sync模式修改：<input :value="value" @input="handleChange"/>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String
    }
  },
  methods: {
    handleChange (e) {
      this.$emit('update:value', e.target.value) // 通过触发事件update:props
    }
  }
}
</script>
