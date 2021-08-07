<template>
  <!--v-bind="getFormProps()" @submit.native.prevent="handleSubmit"是必须的-->
  <el-form v-bind="getFormProps()" @submit.native.prevent="handleSubmit">
    <el-form-item label="操作类型" prop="type" :rules="[{ required: true, message: '请输入操作类型' }]">
      <el-select v-model="form.type" @change="handleChange">
        <el-option v-for="(item,index) in options" :key="index" v-bind="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="显示文字" prop="label" :rules="[{ required: true, message: '请输入显示文字' }]">
      <el-input v-model.trim="form.label"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  mixins: [
    ms.mixins.form
  ],
  data () {
    return {
      options: [
        {value: 'delete', label: '删除'}, 
        {value: 'export', label: '导出'},
        {value: 'import', label: '导入'}, 
        {value: 'update', label: '更新'}
      ],
      form: { // 必须使用form来绑定表单数据
        type: '',
        label: ''
      }
    }
  },
  methods: {
    handleChange(value) {
      let result = this.options.find(item => item.value === value)
      if (result) {
        this.form.label = result.label
      }
    },
    fetch () {
      return Promise.resolve(this.params)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
