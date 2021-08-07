<template>
  <!--v-bind="getFormProps()" @submit.native.prevent="handleSubmit"是必须的-->
  <el-form v-bind="getFormProps()" @submit.native.prevent="handleSubmit">
    <el-form-item label="prop" prop="prop" :rules="[{ required: true, message: '请输入prop' }]">
      <el-input v-model.trim="form.prop"></el-input>
    </el-form-item>
    <el-form-item label="属性名" prop="label" :rules="[{ required: true, message: '请输入属性名' }]">
      <el-input v-model.trim="form.label"></el-input>
    </el-form-item>
    <el-form-item label="搜索框类型" prop="label" :rules="[{ required: true, message: '请输入搜索框类型' }]">
      <el-select v-model="form.component">
        <el-option v-for="(item,index) in options" :key="index" v-bind="item"></el-option>
      </el-select>
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
        {
          label: '输入框',
          value: 'el-input'
        },
        {
          label: '下拉框',
          value: 'el-select'
        }
      ],
      form: { // 必须使用form来绑定表单数据
        prop: '',
        label: '',
        component: ''
      }
    }
  },
  methods: {
    fetch () {
      return Promise.resolve(this.params)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
