<template>
  <!--v-bind="getFormProps()" @submit.native.prevent="handleSubmit"是必须的-->
  <el-form v-bind="getFormProps()" @submit.native.prevent="handleSubmit">
    <el-form-item label="是否可创建" prop="create">
      <el-switch v-model="form.create"></el-switch>
    </el-form-item>
    <el-form-item label="是否可删除" prop="delete">
      <el-switch v-model="form.delete"></el-switch>
    </el-form-item>
    <el-form-item label="批量删除" prop="export">
      <el-switch v-model="form.batchDelete"></el-switch>
    </el-form-item>
    <el-form-item label="是否可导出" prop="import">
      <el-switch v-model="form.export"></el-switch>
    </el-form-item>
    <el-form-item label="是否可导入" prop="batchDelete">
      <el-switch v-model="form.import"></el-switch>
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
        create: false,
        delete: false,
        export: false,
        import: false,
        batchDelete: false
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
