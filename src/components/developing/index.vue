<template functional>
  <div :class="['e-developing', data.staticClass, data.class]"
    :style="data.staticStyle && data.style ? [data.staticStyle,data.style] : data.staticStyle || data.style"
    v-bind="data.attrs"
    v-on="listeners">
    <div class="e-developing-icon">
      <e-icon>&#xe84f;</e-icon>
    </div>
    <div class="e-developing-text">
      {{props.text || '工程们正在开发中...'}}
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  componentName: 'EDeveloping'
}
</script>
