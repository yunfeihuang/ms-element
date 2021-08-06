<template>
  <!--v-bind="getFormProps()" @submit.native.prevent="handleSubmit"是必须的-->
  <el-form v-bind="getFormProps({labelWidth: '8rem'})" @submit.native.prevent="handleSubmit">
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
    <el-form-item label="接口地址" prop="api" :rules="[{required: true, message: '请输入接口地址'}]">
      <el-input v-model="form.api"></el-input>
      <a href="https://www.npmjs.com/package/restful-api" target="_blank">参考 https://www.npmjs.com/package/restful-api 规范</a>
    </el-form-item>
    <el-form-item label="数据id prop" prop="idProp" :rules="[{required: true, message: '请输入数据id prop'}]">
      <el-input v-model="form.idProp"></el-input>
    </el-form-item>
    <el-form-item label="是否显示序号" prop="idProp">
      <el-switch v-model="form.serialNumber"></el-switch>
    </el-form-item>
    <el-form-item label="批量操作" prop="idProp">
      <el-checkbox-group v-model="form.action">
        <el-checkbox
          v-for="(item, index) in [{value: 'delete', label: '删除'}, {value: 'export', label: '导出'}, {value: 'import', label: '导入'}]"
          :key="index" :label="item.value">
          {{item.label}}
        </el-checkbox>
      </el-checkbox-group>
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
        dir: '',
        route: {
          path: '',
          meta: {
            title: ''
          }
        },
        api: '',
        idProp: 'id',
        serialNumber: false,
        action: []
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
