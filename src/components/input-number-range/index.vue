<template>
  <div class="e-input-number-range">
    <el-input-number v-bind="$props" :controls="false" :noZero="myNoZero" :value="myValue[0]" @change="handleChange(0, $event)"/>
    <span class="e-input-number-range-join">~</span>
    <el-input-number v-bind="$props" :controls="false" :noZero="myNoZero" :value="myValue[1]" @change="handleChange(1, $event)" />
  </div>
</template>
<script>
import {InputNumber} from 'element-ui'
import emitter from '@/utils/emitter.js'
export default {
  componentName: 'EInputNumberRange',
  mixins: [emitter],
  props: {
    ...InputNumber.props, // 继承Input的所有属性
    value: {
      type: Array,
      default () { return [0, 0] }
    },
    validateEvent: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    myNoZero () {
      if (this.value[0] !== 0 || this.value[1] !== 0) {
        return false
      }
      return this.noZero
    }
  },
  data () {
    let myValue = this.limitComputed(this.value)
    return {
      myValue
    }
  },
  watch: {
    value (value) {
      this.myValue = value
    }
  },
  mounted () {
    this.$el.addEventListener('focusin', () => {
      this.$$timer && clearTimeout(this.$$timer)
      this.$el.classList.add('is-focus')
    }, false)
    this.$el.addEventListener('focusout', () => {
      this.$$timer && clearTimeout(this.$$timer)
      this.$$timer = setTimeout(() => {
        this.$el.classList.remove('is-focus')
      }, 100)
    }, false)
  },
  methods: {
    limitComputed (value) {
      if (value[0] > value[1]) {
        value[0] = value[1]
      }
      if (this.min) {
        value[0] < this.min && (value[0] = this.min)
        value[1] < this.min && (value[1] = this.min)
      }
      if (this.max) {
        value[0] > this.max && (value[0] = this.max)
        value[1] > this.max && (value[1] = this.max)
      }
      return value
    },
    handleChange (index, value) {
      let myValue = [...this.value]
      myValue[index] = value
      if (index === 0 && myValue[0] > myValue[1]) {
        myValue[1] = value
      }
      if (index === 1 && myValue[0] > myValue[1]) {
        myValue[0] = value
      }
      myValue = this.limitComputed(myValue)
      this.$emit('change', myValue).$emit('input', myValue)
      if (this.validateEvent) { // 触发表单校验
        this.dispatch('ElFormItem', 'el.form.change', [myValue])
        this.dispatch('ElFormItem', 'el.form.blur', [myValue])
      }
    }
  }
}
</script>
