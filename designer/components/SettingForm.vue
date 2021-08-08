<template>
  <!--v-bind="getFormProps()" @submit.native.prevent="handleSubmit"是必须的-->
  <el-form v-bind="getFormProps({labelWidth: '8rem'})" @submit.native.prevent="handleSubmit">
    <el-form-item label="分组">
      <el-input v-model="form.route.meta.group"></el-input>
    </el-form-item>
    <el-form-item label="目录名称" prop="dir" :rules="[{required: true, message: '请输入目录名称'}]">
      <el-input v-model="form.dir" placeholder="如: user" @change="val => {form.route.path = '/' + val}">
        <template slot="prepend">项目目录: src/views/</template>
      </el-input>
    </el-form-item>
    <el-form-item label="路由地址" prop="route.path" :rules="[{required: true, message: '请输入路由地址'}]">
      <el-input v-model="form.route.path" ></el-input>
    </el-form-item>
    <el-form-item label="页面标题" prop="route.meta.title" :rules="[{required: true, message: '请输入页面标题'}]">
      <el-input v-model="form.route.meta.title" ></el-input>
    </el-form-item>
    <el-form-item label="restful接口" prop="restfulApi">
      <el-input v-model="form.restfulApi"></el-input>
      <a href="https://www.npmjs.com/package/restful-api" target="_blank">参考 https://www.npmjs.com/package/restful-api 规范</a>
      <div>响应回的JSON数据结构：{data: {currentPage: 1, pageSize: 20, total: 100, data: []}}</div>
    </el-form-item>
    <el-form-item label="数据id prop" prop="idProp" :rules="[{required: true, message: '请输入数据id prop'}]">
      <el-input v-model="form.idProp"></el-input>
    </el-form-item>
    <el-form-item label="是否显示序号" prop="table.serialNumber">
      <el-switch v-model="form.table.serialNumber"></el-switch>
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
      form: this.params
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
