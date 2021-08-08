<template>
  <!--v-bind="getFormProps()" @submit.native.prevent="handleSubmit"是必须的-->
  <el-form v-bind="getFormProps()" @submit.native.prevent="handleSubmit">
    <el-form-item label="prop" prop="prop" :rules="[{ required: true, message: '请输入prop' }]">
      <el-input v-model.trim="form.prop"></el-input>
    </el-form-item>
    <el-form-item label="属性名" prop="label" :rules="[{ required: true, message: '请输入属性名' }]">
      <el-input v-model.trim="form.label"></el-input>
    </el-form-item>
    <el-form-item label="搜索框类型" prop="component" :rules="[{ required: true, message: '请输入搜索框类型' }]">
      <el-select v-model="form.component">
        <el-option v-for="(item,index) in $const.componentOption.filter(item => !['el-upload', 'el-swicth', 'el-checkbox-group', 'el-radio-group'].includes(item.value))" :key="index" v-bind="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="候选数据" v-if="['el-select','el-checkbox-group','el-radio-group'].includes(form.component)">
      <input-json v-model="form.slots"></input-json>
    </el-form-item>
  </el-form>
</template>

<script>
import InputJson from './InputJson'
export default {
  components: {
    InputJson
  },
  mixins: [
    ms.mixins.form
  ],
  data () {
    return {
      form: { // 必须使用form来绑定表单数据
        prop: '',
        label: '',
        component: 'el-input',
        slots: []
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
