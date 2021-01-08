<template functional>
  <el-row type="flex" align="middle" justify="center" :class="['e-placeholder', data.staticClass, data.class]"
    :style="data.staticStyle && data.style ? [data.staticStyle,data.style] : data.staticStyle || data.style"
    v-bind="data.attrs"
    v-on="listeners">
    <div class="e-placeholder-inner">
      <slot v-if="$slots['icon']"></slot>
      <e-icon v-else>&#xe708;</e-icon>
      <slot v-if="$slots['text']" name="text"></slot>
      <div v-else class="e-placeholder-text">{{props.text || '暂无数据'}}</div>
      <slot></slot>
    </div>
  </el-row>
</template>

<script>
export default {
  componentName: 'EPlaceholder'
}
</script>
