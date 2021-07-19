<template>
  <!--v-bind="getFormProps()" @submit.native.prevent="handleSubmit"是必须的-->
  <el-form v-bind="getFormProps()" @submit.native.prevent="handleSubmit">
    <el-form-item label="属性名" prop="name" :rules="[{ required: true, message: '请输入用户名' }]">
      <el-input v-model.trim="form.name"></el-input>
    </el-form-item>
    <el-form-item label="lable" prop="name" :rules="[{ required: true, message: '请输入用户名' }]">
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
        name: '',
        label: ''
      }
    }
  },
  methods: {
    fetch () {
      return new Promise((resolve, reject) => {
        setTimeout(resolve(this.params), 2000)
      })
    },
    submit () { // 表单校验通过后调用的方法，一般是请求后台接口的方法
      return new Promise((resolve, reject) => {
        setTimeout(resolve, 1000)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
