<template>
  <!--v-bind="getFormProps()" @submit.native.prevent="handleSubmit"是必须的-->
  <el-form v-bind="getFormProps()" @submit.native.prevent="handleSubmit">
    <el-form-item label="类型" prop="type" :rules="[{ required: true, message: '请输入类型' }]">
      <el-select v-model="form.type">
        <el-option v-for="(item,index) in options" :key="index" v-bind="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="标题" prop="label" :rules="[{ required: true, message: '请输入标题' }]">
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
        {value: 1, label: '页面'},
        {value: 0, label: '目录'},
      ],
      form: { // 必须使用form来绑定表单数据
        type: 1,
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
