<template>
  <div class="e-marquee-item">
    <slot></slot>
  </div>
</template>

<script>
export default {
  componentName: 'EMarqueeItem',
  mounted () {
    this.$nextTick(() => {
      this.$parent.destroy()
      this.$parent.init()
      this.$parent.start()
    })
  }
}
</script>
