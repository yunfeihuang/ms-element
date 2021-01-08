<template>
  <div class="e-scroll-in-view--wrapper">
    <div :class="[
        'e-scroll-in-view',
        `e-scroll-in-view--effect-${effect}`,
        `to-direction-${direction}`,
        {'is-active': inView}
      ]"
        :style="`transition: ${transition}`"
      >
      <slot v-bind="{inView: inView}"></slot>
    </div>
  </div>
</template>

<script>
export default {
  componentName: 'EScrollInView',
  props: {
    disabled: {
      type: Boolean
    },
    effect: {
      type: String,
      default: 'fadein'
    },
    duration: {
      type: String,
      default: '1.3s'
    },
    delay: {
      type: String,
      default: '0.2s'
    },
    direction: {
      type: String,
      default: 'top'
    },
    isWindowScroll: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      inView: false
    }
  },
  computed: {
    transition () {
      if (this.effect === 'fadein') {
        return `transform ${this.duration} ease ${this.delay}, opacity ${this.duration} ease ${this.delay}`
      }
      return `transform ${this.duration} ease ${this.delay}, opacity ${this.duration} ease ${this.delay}`
    }
  },
  mounted () {
    if (!this.disabled) {
      if (this.inViewPort()) {
        this.inView = true
      } else if (this.isWindowScroll) {
        this.$$scrollNode = window
        if (this.$$scrollNode) {
          this.$$scrollNode.addEventListener('scroll', this.handleScroll)
        }
      } else if (this.$el.offsetParent) {
        this.$$scrollNode = this.getScrollNode(this.$el.offsetParent)
        if (this.$$scrollNode) {
          this.$$scrollNode.addEventListener('scroll', this.handleScroll)
        }
      }
    }
  },
  methods: {
    handleScroll () {
      this.$$timer && clearTimeout(this.$$timer)
      this.$$timer = setTimeout(() => {
        if (this.inViewPort()) {
          this.inView = true
          this.$$scrollNode.removeEventListener('scroll', this.handleScroll)
        }
      }, 32)
    },
    inViewPort () {
      if (this.$el.offsetWidth === 0 && this.$el.offsetHeight === 0) {
        return false
      }
      let rect = this.$el.getBoundingClientRect()
      return rect.top < window.innerHeight
    },
    getScrollNode (node) {
      let n = node
      let closest = () => {
        let styleObject = window.getComputedStyle(n)
        if (!(['scroll', 'auto'].indexOf(styleObject['overflow']) > -1 || ['scroll', 'auto'].indexOf(styleObject['overflow-y']) > -1 || styleObject['-webkit-overflow-scrolling'] === 'touch' || styleObject['overflow-scrolling'] === 'touch')) {
          n = n.offsetParent
          if (n === document.body) {
            n = window
          } else {
            n && closest()
          }
        }
      }
      if (document.body === n) {
        n = window
      } else {
        closest()
      }
      return n
    }
  }
}
</script>
