<template>
  <ms-form :option="option" v-bind="msPageList.getFormProps()" @submit.native.prevent="msPageList.handleSubmit">
    <slot name="prepend"></slot>
    <!--native-type="submit"是修改button type属性为submit-->
    <el-button native-type="submit" size="small">搜索</el-button>
    <el-button size="small">高级搜索</el-button>
    <slot></slot>
  </ms-form>
</template>

<script>
export default {
  componentName: 'MsQueryForm',
  inject: ['msPageList'],
  props: {
    option: {
      type: Array
    }
  },
  watch: {
    option: {
      immediate: true,
      handler (value) {
        if (value && value.forEach) {
          value.forEach(item => {
            if (!(this.$scopedSlots[item.prop] || this.$slots[item.prop])) {
              if (this.msPageList.query && this.msPageList.query[item.prop] === undefined) {
                this.$set(this.msPageList.query, item.prop, item.value)
              }
            }
          })
        }
      }
    }
  }
}
</script>
<style lang="scss">
</style>
