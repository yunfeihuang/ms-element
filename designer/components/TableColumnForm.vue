<template>
  <!--v-bind="getFormProps()" @submit.native.prevent="handleSubmit"是必须的-->
  <el-form v-bind="getFormProps()" @submit.native.prevent="handleSubmit">
    <el-form-item label="prop" prop="prop" :rules="[{ required: true, message: '请输入prop' }]">
      <el-input v-model.trim="form.prop"></el-input>
    </el-form-item>
    <el-form-item label="属性名" prop="label" :rules="[{ required: true, message: '请输入属性名' }]">
      <el-input v-model.trim="form.label"></el-input>
    </el-form-item>
    <el-form-item label="是否排序" prop="sortable">
      <el-switch v-model="form.sortable"></el-switch>
    </el-form-item>
    <el-form-item label="是否隐藏列" prop="hidden">
      <el-switch v-model="form.hidden"></el-switch>
    </el-form-item>
    <el-form-item label="创/编/搜" prop="isUpdate">
      <el-checkbox-group v-model="form.action">
        <el-checkbox
          v-for="(item, index) in [{value: 'create', label: '创建'}, {value: 'update', label: '编辑'}, {value: 'search', label: '搜索'}]"
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
        prop: '',
        label: '',
        sortable: false,
        hidden: false,
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
