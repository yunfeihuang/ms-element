<template>
  <!--v-bind="getFormProps()" @submit.native.prevent="handleSubmit"是必须的-->
  <el-form label-width="50px">
    <el-form-item prop="json">
      <el-input placeholder="请输入json数据" :rows="20" type="textarea" v-model="form.json"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      form: { // 必须使用form来绑定表单数据
        json: this.params.json
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
