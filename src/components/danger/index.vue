<template functional>
  <div :class="['e-danger', data.staticClass, data.class]"
    :style="data.staticStyle && data.style ? [data.staticStyle,data.style] : data.staticStyle || data.style"
    v-bind="data.attrs"
    v-on="listeners">
    <slot></slot>
  </div>
</template>

<script>
export default {
  componentName: 'EDanger'
}
</script>
