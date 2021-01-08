<template functional>
  <el-date-picker :class="[data.staticClass, data.class]"
    :style="data.staticStyle && data.style ? [data.staticStyle,data.style] : data.staticStyle || data.style"
    v-bind="$options.methods.getProps(data.attrs)"
    @change="$options.methods.handleChange($event)">
  </el-date-picker>
</template>

<script>
export default {
  componentName: 'EDateRangePicker',
  methods: {
    getProps (props) {
      let fn = ($picker, days) => {
        let now = new Date()
        now.setHours(0)
        now.setMinutes(0)
        now.setSeconds(0)
        now.setMilliseconds(0)
        const end = new Date(now.getTime())
        const start = new Date(now.getTime())
        start.setTime(start.getTime() - 3600 * 1000 * 24 * days)
        $picker.$emit('pick', [start, end])
      }
      let pickerOptions = {
        shortcuts: [{
          text: '最近1个月',
          onClick (picker) {
            fn(picker, 30)
          }
        }, {
          text: '最近3个月',
          onClick (picker) {
            fn(picker, 90)
          }
        }, {
          text: '最近半年',
          onClick (picker) {
            fn(picker, 183)
          }
        }]
      }
      return Object.assign({
        type: 'daterange',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        pickerOptions
      }, props)
    },
    handleChange (listeners, value) {
      console.log(listeners, value)
      listeners['input'] && listeners['input'](value)
      listeners['change'] && listeners['change'](value)
    }
  }
}
</script>
