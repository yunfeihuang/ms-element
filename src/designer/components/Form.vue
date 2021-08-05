<template>
  <!--v-bind="getFormProps()" @submit.native.prevent="handleSubmit"是必须的-->
  <el-form v-bind="getFormProps()" @submit.native.prevent="handleSubmit">
    <el-popover
      v-for="(item,index) in option"
      :key="index"
      placement="bottom"
      title="标题"
      width="200">
      <div>
        <el-form-item label="是否必填">
          <el-switch :value="item.rules.some(item => item.required)" @change="handleRequiredChange(item, $event)"></el-switch>
        </el-form-item>
        <el-form-item label="输入框类型">
          <el-select v-model="item.component" @change="handleComponentChange(item.props, $event)">
            <el-option v-for="(item,index) in componentOption" :key="index" v-bind="item"></el-option>
          </el-select>
        </el-form-item>
        <template v-if="item.component == 'el-input'">
          <el-form-item label="是否多行">
            <el-switch :value="item.props.type == 'textarea'" @change="handlePropsChange(item.props, 'type', $event)"></el-switch>
          </el-form-item>
          <el-form-item label="最大长度">
            <el-input v-model="item.props.maxlength" @change="$forceUpdate()"></el-input>
          </el-form-item>
        </template>
        <template v-else-if="item.component == 'el-input-number'">
          <el-form-item label="精度">
            <el-input-number controls-position="right" v-model="item.props.precision" @change="$forceUpdate()"></el-input-number>
          </el-form-item>
        </template>
        <template v-else-if="item.component == 'el-select'">
          <el-form-item label="是否多选">
            <el-switch v-model="item.props.multiple" @change="$forceUpdate()"></el-switch>
          </el-form-item>
        </template>
      </div>
      <el-form-item
        :class="{'is-required': item.rules.some(item => item.required)}"
        slot="reference"
        :label="item.label"
        :prop="item.prop"
        :rules="item.rules">
        <component :is="item.component" v-bind="item.props" controls-position="right">
          <template v-if="item.component === 'el-select' && item.props && item.props.option">
            <el-option v-for="(item,index) in item.props.option" :key="index" v-bind="item"></el-option>
          </template>
        </component>
      </el-form-item>
    </el-popover>
  </el-form>
</template>

<script>
const componentOption = [
  { value: 'el-input', label: '文本输入框' },
  { value: 'el-input-number', label: '数字框' },
  { value: 'el-switch', label: '开关' },
  { value: 'el-select', label: '下拉框' },
  { value: 'el-checkbox-group', label: '复选框' },
  { value: 'el-radio-group', label: '单选框' },
  { value: 'el-upload', label: '上传' },
  { value: 'el-date-picker', label: '日期选择器' },
  { value: 'el-time-picker', label: '时间选择器' }
]
export default {
  mixins: [
    ms.mixins.form
  ],
  data () {
    let form = {}
    let option = this.params.map(item => {
      form[item.prop] = null
      if (!item.props) {
        item.props = {}
      }
      if (!item.component) {
        item.component = 'el-input'
      }
      if (!item.rules) {
        item.rules = []
      }
      return item
    })
    return {
      option,
      componentOption,
      form
    }
  },
  methods: {
    getFormData () {
      return this.option
    },
    validate () {
      this.beforeSubmit && this.beforeSubmit()
    },
    handleComponentChange (props, value) {
      const defaultValue = {
        'el-input': '',
        'el-input-number': 10,
        'el-select': []
      }
      if (defaultValue[value]) {
        props.value = defaultValue[value]
      }
      this.$forceUpdate()
    },
    handlePropsChange (props, key, value) {
      if (key === 'type') {
        props.type = value ? 'textarea' : ''
      }
      this.$forceUpdate()
    },
    handleRequiredChange (item, value) {
      if (!value) {
        item.rules = item.rules.filter(item => !item.required)
      } else {
        item.rules.push({required: true, message: `请输入${item.label}`})
      }
      this.$forceUpdate()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
