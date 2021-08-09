<template>
  <!--v-bind="getFormProps()" @submit.native.prevent="handleSubmit"是必须的-->
  <el-form v-bind="getFormProps({labelWidth: '0px'})" @submit.native.prevent="handleSubmit">
    <el-form-item prop="json" :rules="[{ required: true, message: '请输入json数据' }]">
      <el-input placeholder="请输入json数据" :rows="20" type="textarea" v-model="form.json"></el-input>
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
        json: ''
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
