<template>
  <el-form v-bind="$attrs">
    <slot name="prepend"></slot>
    <el-form-item v-for="(item, index) in __option" :key="index" v-bind="getFormItemProps(item)">
      <template v-if="item.option">
        <el-checkbox-group
          v-if="item.component == 'el-checkbox-group'"
          v-bind="item.props"
          v-model="model[item.prop]">
          <el-checkbox
            v-for="item in item.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-checkbox>
        </el-checkbox-group>
        <el-radio-group
          v-else-if="item.component == 'el-radio-group'"
          v-bind="item.props"
          v-model="model[item.prop]">
          <el-radio
            v-for="item in item.option"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-radio>
        </el-radio-group>
        <el-select
          v-else
          v-bind="item.props"
          v-model="model[item.prop]">
          <el-option
            v-for="item in item.option"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </template>
      <slot v-else-if="$scopedSlots[item.prop] || $slots[item.prop]" :name="item.prop" v-bind="item.props"></slot>
      <component v-else :is="item.component || 'el-input'" v-bind="item.props" v-model="model[item.prop]"/>
    </el-form-item>
    <slot></slot>
  </el-form>
</template>

<script>
export default {
  componentName: 'MsForm',
  props: {
    option: {
      type: Array
    },
    model: {}
  },
  computed: {
    __option () {
      this.option.forEach(item => {
        if (item && item.label && item.props && !item.props.placeholder) {
          item.props.placeholder = '请输入' + item.label
        }
      })
      return this.option
    }
  },
  methods: {
    getFormItemProps (item) {
      let {props, ...others} = item
      return others
    }
  }
}
</script>
<style lang="scss">
</style>
