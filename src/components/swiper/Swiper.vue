<template>
  <div :class="['vx-swiper', 'swiper-container']" >
    <div class="swiper-wrapper" >
      <slot></slot>
    </div>
    <div v-if="pagination" class="swiper-pagination"></div>
    <div v-if="navigation===true" class="swiper-button-prev"></div>
    <div v-if="navigation===true" class="swiper-button-next"></div>
    <div v-if="scrollbar" class="swiper-scrollbar"></div>
  </div>
</template>

<script>
export default {
  componentName: 'ESwiper',
  props: {
    active: {
      type: Number,
      default: 0
    },
    autoplay: {
      type: [Boolean, Object],
      default () {
        return {disableOnInteraction: false}
      }
    },
    options: {
      type: Object
    },
    pagination: {
      type: [Boolean, Object],
      default: true
    },
    navigation: {
      type: [Boolean, Object],
      default: false
    },
    scrollbar: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    require('swiper/dist/css/swiper.min.css')
    import('swiper').then(Swiper => {
      let options = Object.assign({
        initialSlide: this.active,
        disableOnInteraction: false,
        autoplay: this.autoplay,
        onSlideChangeStart: (swiper) => {
          this.$emit('change', swiper.activeIndex).$emit('update:active', swiper.activeIndex)
        }
      }, this.options)
      if (this.pagination === true) {
        options.pagination = {
          el: '.swiper-pagination',
          clickable: true
        }
      }
      if (this.navigation === true) {
        options.navigation = {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
      if (this.scrollbar) {
        options.scrollbar = '.swiper-scrollbar'
      }
      this.$$swiper = new Swiper.default(this.$el, options) // eslint-disable-line
    })
  },
  watch: {
    active (value) {
      this.$$swiper.activeIndex !== value && this.$$swiper.slideTo(value)
    }
  },
  methods: {
    getSwiper () {
      return this.$$swiper
    }
  }
}
</script>
