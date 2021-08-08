<template>
  <!--v-bind="getFormProps()" @submit.native.prevent="handleSubmit"是必须的-->
  <el-form v-bind="getFormProps({labelWidth: '8rem'})" @submit.native.prevent="handleSubmit">
    <el-form-item v-for="(item,index) in column" :key="index" :label="item.label">
      <el-input v-model="form[item.prop]"></el-input>
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
      column: this.params.column,
      form: this.params.row
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
