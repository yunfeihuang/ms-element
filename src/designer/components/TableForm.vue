<template>
  <!--v-bind="getFormProps()" @submit.native.prevent="handleSubmit"是必须的-->
  <el-form v-bind="getFormProps()" @submit.native.prevent="handleSubmit">
    <el-form-item label="属性key" prop="prop" :rules="[{ required: true, message: '请输入属性key' }]">
      <el-input v-model.trim="form.prop"></el-input>
    </el-form-item>
    <el-form-item label="属性名" prop="label" :rules="[{ required: true, message: '请输入属性名' }]">
      <el-input v-model.trim="form.label"></el-input>
    </el-form-item>
    <el-form-item label="属性模拟值" prop="value">
      <el-input v-model.trim="form.value"></el-input>
    </el-form-item>
    <el-form-item label="是否可搜索" prop="value">
      <el-switch v-model="form.isSearch"></el-switch>
    </el-form-item>
    <el-form-item label="是否可编辑" prop="value">
      <el-switch v-model="form.isUpdate"></el-switch>
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
        label: '',
        value: '',
        isSearch: false,
        isUpdate: false
      }
    }
  },
  methods: {
    fetch () {
      return new Promise((resolve, reject) => {
        setTimeout(resolve(this.params), 2000)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
