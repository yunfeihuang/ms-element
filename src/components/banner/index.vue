<template functional>
  <div :class="['e-banner', data.staticClass, data.class]"
    :style="`background-image:url(${props.src});height:${props.height}`"
    v-bind="data.attrs"
    v-on="listeners">
    <div class="e-banner-inner">
      <e-scroll-in-view>
        <slot v-if="$slots['primary']" name="primary"></slot>
        <div v-else-if="props.primary" class="e-banner-primary">
          {{props.primary}}
        </div>
        <slot v-if="$slots['secondary']" name="secondary"></slot>
        <div v-else-if="props.secondary" class="e-banner-secondary">
          {{props.secondary}}
        </div>
        <slot></slot>
      </e-scroll-in-view>
    </div>
  </div>
</template>
<script>
export default {
  componentName: 'EBanner'
}
</script>
