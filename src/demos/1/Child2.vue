<template>
  <div>
   输入框：<input :value="value" @input="handleChange"/>
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
      this.$emit('change', e) // 通过触发事件模块修改父层value值
    }
  }
}
</script>
