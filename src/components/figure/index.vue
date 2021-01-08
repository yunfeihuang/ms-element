<template functional>
  <div :class="['e-figure', `${(props.theme || ['default']).map(item => {return 'e-figure--theme-'+item}).join(' ')}`, data.staticClass, data.class]"
    :style="data.staticStyle && data.style ? [data.staticStyle,data.style] : data.staticStyle || data.style"
    v-bind="data.attrs"
    v-on="listeners">
    <div class="e-figure-image" v-if="props.image || $slots['image']">
      <slot name="image" v-if="$slots['image']"></slot>
      <img v-else :src="props.image"/>
    </div>
    <div class="e-figure-text">
      <div class="e-figure-text-inner">
        <slot name="figcaption" v-if="$slots['figcaption']"></slot>
        <figcaption class="e-figure-figcaption" v-else-if="props.figcaption" :title="props.figcaption">{{props.figcaption}}</figcaption>
        <slot name="secondary" v-if="$slots['secondary']"></slot>
        <div class="e-figure-secondary" v-else-if="props.secondary" :title="props.secondary">{{props.secondary}}</div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  componentName: 'EFigure'
}
</script>
