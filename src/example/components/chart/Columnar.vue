<template>
  <div class="chart-columnar"></div>
</template>

<script>
import mixin from './mixin'
export default {
  mixins: [mixin],
  methods: {
    render () {
      let xAxis = this.option.xAxis.map(item => {
        return Object.assign({
          type: 'category'
        }, item)
      })
      let yAxis = [
        {type: 'value'}
      ]
      if (this.option.yAxis) {
        yAxis = this.option.yAxis
      }
      let isTop = JSON.stringify(xAxis).indexOf('"data":') > -1
      let series = this.option.series.map(item => {
        return {
          itemStyle: {
            normal: {
              color: '#409EFF',
              label: {
                show: true,
                position: isTop ? 'top' : 'right',
                formatter: '{c}'
              }
            }
          },
          type: 'bar',
          ...item
        }
      })
      this.$$chart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        calculable: true,
        grid: {
          left: '3%',
          right: isTop ? '3%' : '6%',
          bottom: '0%',
          top: isTop ? '6%' : '0%',
          containLabel: true
        },
        xAxis: xAxis,
        yAxis: yAxis,
        series: series
      })
    }
  }
}
</script>

<style lang="scss">
</style>
