<template functional>
  <div :class="['e-summary-wrapper', data.staticClass, data.class]"
    :style="data.staticStyle && data.style ? [data.staticStyle,data.style] : data.staticStyle || data.style"
    v-bind="data.attrs"
    v-on="listeners">
    <el-row type="flex" :gutter="10" class="e-summary">
      <slot></slot>
    </el-row>
  </div>
</template>

<script>
export default {
  componentName: 'ESummary'
}
</script>
