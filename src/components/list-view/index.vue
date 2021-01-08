<template>
  <div class="e-list-view" v-loading="initLoading">
    <slot></slot>
    <el-button :disabled="!isMore" class="list-view-more" v-if="!initLoading" :loading="loading">
      {{isMore ? (loading ? moreLoadingText : moreText) : moreEndText}}
    </el-button>
    <router-link :to="{path: $route.path, query: params}" class="list-view-link">下一页</router-link>
  </div>
</template>

<script>
export default {
  componentName: 'EListView',
  props: {
    scrollDom: {},
    loading: {
      type: Boolean,
      default: false
    },
    moreText: {
      type: String,
      default: '更多'
    },
    moreLoadingText: {
      type: String,
      default: '努力加载中...'
    },
    moreEndText: {
      type: String,
      default: '没有更多了'
    },
    isMore: {
      type: Boolean,
      default: true
    },
    params: { // 下一页的参数
      type: Object
    }
  },
  watch: {
    isMore (value) {
      if (value) {
        this.addScrollEvent()
      } else {
        this.removeScrollEvent()
      }
    }
  },
  data () {
    return {
      initLoading: !this.$nuxt
    }
  },
  updated () {
    if (this.initLoading) {
      this.$nextTick(() => {
        this.initLoading = false
      })
    }
  },
  mounted () {
    if (this.$listeners.fetch) {
      this.$emit('fetch')
    }
    this.$$scrollNode = this.scrollDom || document
    this.addScrollEvent()
    this.$$winHeight = window.innerHeight
  },
  methods: {
    addScrollEvent () {
      if (this.$$scrollNode.addEventListener) {
        this.$$scrollNode.addEventListener('scroll', this.handleScroll, false)
      } else {
        this.$$scrollNode.attachEvent && this.$$scrollNode.attachEvent('onscroll', this.handleScroll)
      }
    },
    removeScrollEvent () {
      if (this.$$scrollNode.removeEventListener) {
        this.$$scrollNode.removeEventListener('scroll', this.handleScroll)
      } else {
        this.$$scrollNode.detachEvent && this.$$scrollNode.detachEvent('onscroll', this.handleScroll)
      }
    },
    fetch () {
      this.$emit('update:loading', true)
      this.$emit('fetch')
    },
    handleScroll () {
      if (!this.loading && !this.initLoading && this.isMore) {
        this.$timer && clearTimeout(this.$timer)
        this.$timer = setTimeout(() => {
          let node = this.$el.querySelector('.list-view-more')
          if (node && node.getBoundingClientRect) {
            let rect = node.getBoundingClientRect()
            if (rect.top - 100 < this.$$winHeight) {
              this.fetch()
            }
          }
        }, 200)
      }
    }
  }
}
</script>
