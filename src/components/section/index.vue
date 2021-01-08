<template functional>
  <div :class="['e-section', data.staticClass, data.class]"
    :style="data.staticStyle && data.style ? [data.staticStyle,data.style] : data.staticStyle || data.style"
    v-on="listeners">
    <el-row type="flex" align="middle" class="e-section--header" v-if="$slots.title || $slots.action || props.title">
      <el-col>
        <div class="e-section--title" v-if="!$slots.title && props.title">{{props.title}}</div>
        <slot name="title" v-if="$slots.title"></slot>
      </el-col>
      <slot name="action"></slot>
    </el-row>
    <slot></slot>
  </div>
</template>

<script>
export default {
  componentName: 'ESection'
}
</script>
