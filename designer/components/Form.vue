<template>
  <!--v-bind="getFormProps()" @submit.native.prevent="handleSubmit"是必须的-->
  <el-form v-bind="getFormProps()" @submit.native.prevent="handleSubmit">
    <el-popover
      v-for="(item,index) in option"
      :key="index"
      placement="bottom"
      title="设置"
      width="300">
      <el-form-item
        :class="{'is-required': item.rules.some(item => item.required)}"
        slot="reference"
        :label="item.label"
        :prop="item.prop"
        :rules="item.rules">
        <component :is="item.component" v-bind="item.props" readonly controls-position="right" :placeholder="'请输入'+item.label">
          <template v-if="item.component === 'el-select'">
            <el-option v-for="(item,index) in item.slots" :key="index" v-bind="item"></el-option>
          </template>
          <template v-else-if="item.component === 'el-checkbox-group'">
            <el-checkbox v-for="(item,index) in item.slots" :key="index" v-bind="item"></el-checkbox>
          </template>
          <template v-else-if="item.component === 'el-radio-group'">
            <el-radio v-for="(item,index) in item.slots" :key="index" v-bind="item"></el-radio>
          </template>
          <template v-else-if="item.component === 'el-upload'">
            <el-button>上传</el-button>
          </template>
        </component>
      </el-form-item>
      <div>
        <el-button type="text" style="position:absolute;right:10px;top:10px;" @click="handleDelete(item)">移除</el-button>
        <el-form-item label="prop">
          <el-input v-model="item.prop"></el-input>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="item.label"></el-input>
        </el-form-item>
        <el-form-item label="输入框类型">
          <el-select v-model="item.component" @change="handleComponentChange(item, $event)">
            <el-option v-for="(item,index) in $const.componentOption" :key="index" v-bind="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="候选数据" v-if="['el-select','el-checkbox-group','el-radio-group'].includes(item.component)">
          <input-json v-model="item.slots"></input-json>
        </el-form-item>
        <el-form-item label="是否必填">
          <el-switch :value="item.rules.some(item => item.required)" @change="handleRequiredChange(item, $event)"></el-switch>
        </el-form-item>
        <!--
        <el-form-item label="校验规则">
          <el-select>
            <el-option v-for="(item,index) in validator" :key="index" :value="item" :label=""></el-option>
          </el-select>
        </el-form-item>
        -->
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
            <el-button type="text" @click="item.props.precision = 2">设置金额精度</el-button>
          </el-form-item>
        </template>
        <template v-else-if="item.component == 'el-select'">
          <el-form-item label="是否多选">
            <el-switch v-model="item.props.multiple" @change="handleSelectMultipleChange(item, $event)"></el-switch>
          </el-form-item>
        </template>
        <template v-else-if="item.component == 'el-date-picker'">
          <el-form-item label="是否区间">
            <el-switch :value="item.props.type == 'daterange'" @change="handleDatePickerTypeChange(item, $event)"></el-switch>
          </el-form-item>
          <el-form-item label="日期格式">
            <el-input v-model="item.props.format" @change="$forceUpdate()"></el-input>
          </el-form-item>
        </template>
      </div>
    </el-popover>
    <el-form-item>
      <el-button @click="handleAdd">添加输入项目</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import InputJson from './InputJson'
export default {
  components: {
    InputJson
  },
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
      if (!item.rules) {
        item.rules = []
      }
      return item
    })
    return {
      option,
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
    handleComponentChange (item, value) {
      item.rules = []
      item.props = {}
      const defaultValue = {
        'el-input': '',
        'el-input-number': 10,
        'el-switch': false,
        'el-select': '',
        'el-checkbox-group': [],
        'el-radio-group': [],
        'el-date-picker': null,
        'el-time-picker': null,
        'el-cascader': [],
        'el-tree': []
      }
      if (defaultValue[value]) {
        item.props.value = defaultValue[value]
      }
      if (value === 'el-date-picker') {
        item.props = {
          format: 'YYYY-MM-dd'
        }
      }
      if (['el-select', 'el-checkbox-group', 'el-radio-group'].includes(value)) {
        if (!item.slots) {
          item.slots = []
        }
      } else {
        delete item.slots
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
        const required = {required: true, message: `请输入${item.label}`}
        if (item.component === 'el-input-number') {
          required.type = 'number'
        }
        if (['el-checkbox-group'].includes(item.component) || (item.component === 'el-select' && item.props.multiple)) {
          required.type = 'array'
        }
        item.rules.push(required)
      }
      this.$forceUpdate()
    },
    handleSelectMultipleChange (item, value) {
      item.props.multiple = value
      item.value = value ? [] : ''
    },
    handleDatePickerTypeChange (item, value) {
      item.props.type = value ? 'daterange' : undefined
      this.$forceUpdate()
    },
    handleAdd () {
      this.option.push({
        component: 'el-input',
        prop: Math.random().toString(36).substr(2),
        label: '标题',
        props: {},
        rules: []
      })
      this.$forceUpdate()
    },
    handleDelete (item) {
      this.$confirm('确定删除此数据?', '提示', {
        type: 'warning'
      }).then(() => {
        this.option = this.option.filter(item2 => item2 !== item)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
