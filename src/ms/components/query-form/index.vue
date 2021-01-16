<template>
  <el-form v-bind="$props" @submit.native.prevent="handleSubmit">
    <slot name="prepend"></slot>
    <el-form-item v-for="(item,index) in items" :key="index" :label="item.label" :prop="item.prop">
      <slot v-if="$scopedSlots[item.prop] || $slots[item.prop]" :name="item.prop" v-bind="item"></slot>
      <el-select
        v-else-if="item.options"
        v-model="model[item.prop]"
        :placeholder="item.props && item.props.placeholder ? item.props.placeholder : `请选择${item.label}`"
        v-bind="item.props">
        <el-option
          v-for="item in item.options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input
        v-else
        v-model.trim="model[item.prop]" :placeholder="item.props && item.props.placeholder ? item.props.placeholder : `请输入${item.label}`"
        v-bind="item.props">
      </el-input>
    </el-form-item>
    <!--native-type="submit"是修改button type属性为submit-->
    <el-button native-type="submit" size="small">搜索</el-button>
    <el-button size="small">高级搜索</el-button>
    <slot></slot>
  </el-form>
</template>

<script>
import ElementUI from '@element-ui'

export default {
  componentName: 'MsQueryForm',
  props: {
    items: {
      type: Array,
      default () {
        return []
      }
    },
    ...ElementUI.Form.props
  },
  mounted () {
    this.initReactiveData()
  },
  methods: {
    initReactiveData () {
      let data = {}
      this.items.forEach(item => {
        if (!(this.$scopedSlots[item.prop] || this.$slots[item.prop])) {
          if (this.model[item.prop] === undefined) {
            data[item.prop] = item.value || null
          }
        }
      })
      this.$set(this.model, data)
    },
    handleSubmit () {
      this.$emit('submit')
    }
  }
}
</script>
<style lang="scss">
</style>
