<template functional>
  <div :class="['e-title', `e-title-theme-${props.theme || 'dark'}`, data.staticClass, data.class]"
    :style="data.staticStyle && data.style ? [data.staticStyle,data.style] : data.staticStyle || data.style"
    v-bind="data.attrs"
    v-on="listeners">
    <e-scroll-in-view v-if="props.primary || $slots['primary']" direction="bottom">
      <slot name="primary" v-if="$slots['primary']"></slot>
      <div v-else class="e-title-primary">{{props.primary}}</div>
    </e-scroll-in-view>
    <e-scroll-in-view v-if="props.secondary || $slots['secondary']">
      <slot name="secondary" v-if="$slots['secondary']"></slot>
      <div class="e-title-secondary">{{props.secondary}}</div>
    </e-scroll-in-view>
  </div>
</template>
<script>
export default {
  componentName: 'ETitle'
}
</script>
