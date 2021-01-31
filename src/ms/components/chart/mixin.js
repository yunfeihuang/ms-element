export default {
  props: {
    theme: {
      type: String,
      default: 'shine'
    },
    option: {
      type: Object
    }
  },
  watch: {
    option (value) {
      if (value) {
        if (this.$$chart) {
          this.$$chart.clear()
          this.$nextTick(this.render)
        } else {
          this.initChart()
        }
      }
    }
  },
  mounted () {
    this.option && this.initChart()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
    this.$$chart && this.$$chart.dispose && this.$$chart.dispose()
    this.$$chart = null
  },
  methods: {
    handleResize () {
      this.$$chart && this.$$chart.resize && this.$$chart.resize()
    },
    initChart () {
      let self = this
      import('echarts').then(res => {
        import('echarts/theme/shine').then(res2 => {
          if (self.option) {
            self.$$chart = res.default.init(self.$el, self.theme)
            self.render()
          }
        })
      })
    },
    render () {
      this.$$chart.setOption(this.option)
    }
  }
}
