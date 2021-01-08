<template>
  <img v-bind="$attrs" v-on="$listeners" />
</template>

<script>
import error from './error.svg'
import placeholder from './placeholder.svg'
import loading from './loading.svg'
const transparent = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=='
export default {
  componentName: 'EImg',
  props: {
    src: {
      type: String
    }
  },
  watch: {
    src () {
      this.$nextTick(this.loading)
    }
  },
  mounted () {
    this.loading()
  },
  methods: {
    loading () {
      if (this.src) {
        this.$el.src = transparent
        this.setBackground(loading)
        let image = new Image()
        image.onload = () => {
          this.$el.src = this.src
          this.$el.style.background = ''
        }
        image.onerror = () => {
          this.$el.src = transparent
          this.setBackground(error)
        }
        image.src = this.src
      } else {
        this.$el.src = transparent
        this.setBackground(placeholder)
      }
    },
    setBackground (type) {
      let size = Math.min(this.$el.offsetWidth, this.$el.offsetHeight) > 40 ? '40px' : 'contain'
      this.$el.style.background = `url(${type}) no-repeat center`
      this.$el.style.backgroundSize = size
    }
  }
}
</script>
