<template>
  <div class="chart-pie"></div>
</template>

<script>
import mixin from './mixin'
export default {
  mixins: [mixin],
  methods: {
    render () {
      let series = this.option.series.map(item => {
        return {
          type: 'pie',
          radius: '55%',
          center: ['50%', '40%'],
          ...item
        }
      })
      this.$$chart.setOption({
        tooltip: Object.assign({
          trigger: 'item',
          formatter: '{b} : {c}%'
        }, this.option.tooltip),
        legend: {
          orient: 'horizontal',
          x: 'left',
          y: 'bottom',
          ...this.option.legend
        },
        color: this.option.color,
        calculable: true,
        toolbox: {
          show: true
        },
        series: series
      })
    }
  }
}
</script>

<style lang="scss">
</style>
