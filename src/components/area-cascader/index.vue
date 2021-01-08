<template>
  <cascader
    class="area-cascader"
    ref="cascader"
    v-bind="$props"
    :options="optionsTree"
    @change="handleChange" />
</template>

<script>
import Cascader from 'element-ui/lib/cascader'
export default {
  componentName: 'EAreaCascader',
  components: {
    Cascader
  },
  props: {
    ...Cascader.props,
    options: {
      type: Array,
      required: false
    },
    format: {
      type: String // 省市区 'P-C-D'
    }
  },
  data () {
    return {
      optionsTree: []
    }
  },
  mounted () {
    this._getAreaJSON().then(res => {
      let _areaJSON = res.default
      if (this.format && this.format.indexOf('P') > -1) {
        _areaJSON = _areaJSON.map(p => {
          return {
            label: p.label,
            value: p.value,
            children: this.format.indexOf('C') > -1 ? p.children.map(c => {
              return {
                label: c.label,
                value: c.value,
                children: this.format.indexOf('D') > -1 ? c.children.map(d => {
                  return {
                    label: d.label,
                    value: d.value
                  }
                }) : null
              }
            }) : null
          }
        })
      }
      this.$$areaJSON = this.optionsTree = _areaJSON
    })
  },
  methods: {
    _getAreaJSON () {
      return import('@areaJSON')
    },
    getLabel () {
      let text = this.$el.querySelector('.el-cascader__label').innerText
      return text.split(this.separator || '/')
    },
    handleChange (value) {
      this.$emit('input', value).$emit('change', value)
      this.$nextTick(() => {
        this.$emit('update:label', this.getLabel())
      })
    }
  },
  destroyed () {
    this.$$areaJSON = null
  }
}
</script>
