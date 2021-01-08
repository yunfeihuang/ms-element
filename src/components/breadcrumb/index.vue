<template>
  <el-breadcrumb :class="['e-breadcrumb']"
    v-if="visible"
    v-dom-portal="'.e-frame-layout--breadcrumb'"
    v-bind="$attrs"
    v-on="$listeners">
    <slot></slot>
  </el-breadcrumb>
</template>

<script>
export default {
  componentName: 'EBreadcrumb',
  data () {
    return {
      visible: false
    }
  },
  mounted () {
    this.visible = true
  }
}
</script>
