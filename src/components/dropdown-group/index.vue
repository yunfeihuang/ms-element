<template>
  <el-form-item class="e-dropdown-group" v-bind="formItemProps">
    <el-dropdown slot="label" trigger="click" @command="handleCommand($event)">
      <span class="el-dropdown-link">
        {{activeLabel}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(item, index) in options" :key="index" :command="item.value">{{item.label}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <slot v-bind="currentItem"></slot>
  </el-form-item>
</template>

<script>
export default {
  componentName: 'EDropdownGroup',
  props: {
    model: {
      type: Object
    },
    value: {
      type: [String, Number]
    },
    options: {
      type: Array,
      default () {
        return []
      }
    },
    formItemProps: {
      type: Object
    }
  },
  computed: {
    currentItem () {
      return this.options.filter(item => item.value === this.value)[0]
    },
    activeLabel () {
      let result = this.currentItem
      return result ? result.label : '请选择'
    }
  },
  methods: {
    handleCommand (value) {
      if (this.value !== value) {
        if (this.model) {
          this.options.forEach(item => {
            this.model[item.value] = null
          })
        }
        this.$emit('input', value).$emit('change', value)
      }
    }
  }
}
</script>
