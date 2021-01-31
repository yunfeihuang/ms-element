<template>
  <div class="chart-polyline"></div>
</template>

<script>
import mixin from './mixin'
export default {
  mixins: [mixin],
  methods: {
    render () {
      if (this.option) {
        let option = {
          tooltip: {
            trigger: 'axis'
          },
          calculable: true,
          yAxis: {
            type: 'value'
          },
          grid: {
            left: '1%',
            right: '1%',
            bottom: '3%',
            top: '3%',
            containLabel: true
          },
          ...this.option
        }
        this.$$chart.setOption(option)
      }
    }
  }
}
</script>

<style lang="scss">
</style>
