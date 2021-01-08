<template functional>
  <div :class="[
    'e-detail-layout',
    {'is-breadcrumb':$slots['breadcrumb'] && $slots['breadcrumb'][0] && $slots['breadcrumb'][0].componentOptions.tag == 'el-breadcrumb'},
    data.staticClass,
    data.class]"
    :style="data.staticStyle && data.style ? [data.staticStyle,data.style] : data.staticStyle || data.style"
    v-bind="data.attrs"
    v-on="listeners">
    <slot name="breadcrumb"></slot>
    <slot></slot>
  </div>
</template>

<script>
export default {
  componentName: 'EDetailLayout'
}
</script>
