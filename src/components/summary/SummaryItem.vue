<template functional>
  <el-col :class="[data.staticClass, data.class]"
    :style="data.staticStyle && data.style ? [data.staticStyle,data.style] : data.staticStyle || data.style"
    v-bind="data.attrs"
    v-on="listeners">
      <div class="e-summary-item">
        <slot></slot>
      </div>
  </el-col>
</template>

<script>
export default {
  componentName: 'ESummaryItem'
}
</script>
