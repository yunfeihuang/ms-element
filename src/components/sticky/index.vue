<template>
  <div class="e-sticky" :style="`position: ${type=='sticky'?'sticky':''};top:${type=='sticky'?top:''}`" :class="isSticky && type == 'sticky' ? `is--${type}` : ''">
    <div class="e-sticky-inner" :class="isSticky && type == 'fixed' ? `is--${type}` : ''" :style="`top:${type=='fixed' && isSticky ? top + 'px' : ''}`">
      <slot v-bind="{isSticky: isSticky}"></slot>
    </div>
  </div>
</template>
<script>
export default {
  componentName: 'ESticky',
  props: {
    top: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: 'sticky'
    }
  },
  data () {
    return {
      isSticky: false
    }
  },
  mounted () {
    this.init()
    this.$nextTick(this.init)
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    init () {
      this.$$offsetTop = this.$el.offsetTop - this.top
      if (this.type === 'fixed') {
        this.$$offsetTop += this.$el.offsetHeight
      }
    },
    handleScroll (e) {
      let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
      if (scrollTop > this.$$offsetTop) {
        if (!this.isSticky && this.type === 'fixed') {
          this.$el.style.height = this.$el.offsetHeight + 'px'
        }
        this.isSticky = true
      } else {
        this.isSticky = false
        this.$el.style.height = ''
      }
      if (scrollTop === 0) {
        this.init()
      }
    }
  }
}
</script>
