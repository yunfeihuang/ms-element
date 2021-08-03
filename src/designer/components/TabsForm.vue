<template>
  <!--v-bind="getFormProps()" @submit.native.prevent="handleSubmit"是必须的-->
  <el-form v-bind="getFormProps()" @submit.native.prevent="handleSubmit">
    <el-form-item label="属性key" prop="prop" :rules="[{ required: true, message: '请输入属性key' }]">
      <el-input v-model.trim="form.prop"></el-input>
    </el-form-item>
    <el-form-item label="选项卡名" prop="label" :rules="[{ required: true, message: '请输入选项卡名' }]">
      <el-input v-model.trim="form.label"></el-input>
    </el-form-item>
    <el-form-item label="选项卡值" prop="name" :rules="[{ required: true, message: '请输入选项卡值' }]">
      <el-input v-model.trim="form.name"></el-input>
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
      form: { // 必须使用form来绑定表单数据
        prop: '',
        name: '',
        label: ''
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
