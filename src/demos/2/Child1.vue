<template>
  <div>
   v-model模式修改：<input :value="value" @input="handleChange"/>
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
      this.$emit('input', e.target.value) // v-model绑定模式默认要触发input事件
    }
  }
}
</script>
