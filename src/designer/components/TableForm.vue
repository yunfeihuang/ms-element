<template>
  <!--v-bind="getFormProps()" @submit.native.prevent="handleSubmit"是必须的-->
  <el-form v-bind="getFormProps()" @submit.native.prevent="handleSubmit">
    <el-form-item label="模块名称" prop="api">
      <el-input v-model="form.module"></el-input>
    </el-form-item>
    <el-form-item label="接口地址" prop="api">
      <el-input v-model="form.api"></el-input>
    </el-form-item>
    <el-form-item label="数据id prop" prop="idProp">
      <el-input v-model="form.idProp"></el-input>
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
    <el-button @click="handleExport">生成代码并导出</el-button>
  </el-form>
</template>

<script>
import axios from 'axios'
export default {
  mixins: [
    ms.mixins.form
  ],
  data () {
    return {
      form: { // 必须使用form来绑定表单数据
        module: '',
        api: '',
        idProp: 'id',
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
    },
    handleExport () {
      this.msDrawer.target.config.page = this.form
      axios({
        url: '/designer',
        method: 'post',
        data: {
          config: this.msDrawer.target.config
        }
      }).then(res => {
        if (res.data.data) {
          const link = document.createElement('a')
          link.download = res.data.data
          link.style.display = 'none'
          link.href = res.data.data
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
