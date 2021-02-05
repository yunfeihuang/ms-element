<template>
  <div>
    <el-form-item v-for="(item, index) in option" :key="index" v-bind="getFormItemProps(item)">
      <el-select
        v-if="item.component == 'el-select'"
        v-bind="item.props"
        v-model="model[item.prop]">
        <el-option
          v-for="item in item.options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
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
        v-if="item.component == 'el-radio-group'"
        v-bind="item.props"
        v-model="model[item.prop]">
        <el-radio
          v-for="item in item.options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-radio>
      </el-radio-group>
      <slot v-else-if="$scopedSlots[item.prop] || $slots[item.prop]" :name="item.prop" v-bind="item"></slot>
      <component v-else :is="item.component || 'el-input'" v-bind="item" v-model="model[item.prop]"/>
    </el-form-item>
  </div>
</template>

<script>
export default {
  componentName: 'MsFormItem',
  props: {
    option: {
      type: Array
    },
    model: {
      type: Object
    }
  },
  method: {
    getFormItemProps (item) {
      let {props, ...others} = item
      return others
    }
  }
}
</script>
<style lang="scss">
</style>
