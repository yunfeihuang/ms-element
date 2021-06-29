<template>
  <!--v-bind="getFormProps()" @submit.native.prevent="handleSubmit"是必须的-->
  <el-form v-bind="getFormProps()" @submit.native.prevent="handleSubmit">
    <!--
    <el-form-item label="头像">
      <e-img-upload clearable v-model="form.url"/>
    </el-form-item>
    -->
    <el-form-item label="姓名" prop="name" :rules="[{ required: true, message: '请输入用户名' }]">
      <el-input v-model.trim="form.name"></el-input>
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="form.sex">
        <el-radio label="男"></el-radio>
        <el-radio label="女"></el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="年龄" prop="age">
      <el-input v-model.trim="form.age"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email" :rules="[
      {required: true, message: '请输入邮箱'},
      validator.rule.email
      ]">
      <el-input v-model.trim="form.email"></el-input>
    </el-form-item>
    <el-form-item label="状态">
      <el-select v-model="form.state" placeholder="请选择状态">
        <el-option label="启用" value="shanghai"></el-option>
        <el-option label="禁用" value="beijing"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="工作时间">
      <el-date-picker
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="timestamp"
        :value="form.start_time ? [form.start_time, form.end_time] : null"
        @input="handleDateRangeInput"></el-date-picker>
    </el-form-item>
    <el-form-item label="兴趣爱好">
      <el-checkbox-group v-model="form.hoppy">
        <el-checkbox label="篮球" name="type"></el-checkbox>
        <el-checkbox label="足球" name="type"></el-checkbox>
        <el-checkbox label="羽毛球" name="type"></el-checkbox>
        <el-checkbox label="乒乓球" name="type"></el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="地址">
      <el-input v-model.trim="form.address" type="textarea" :autosize="{minRows: 2}"></el-input>
    </el-form-item>
    <el-form-item label="个人介绍">
      <el-input v-model.trim="form.desc" type="textarea" :autosize="{minRows: 2}"></el-input>
    </el-form-item>
    <el-form-item label="即时配送" v-if="params">
      <el-button @click="handleDetail" type="text">打开详情弹框（同时打开多个侧边弹框）</el-button>
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
        id: '',
        date: '',
        name: ``,
        url: ``,
        address: ``,
        age: '',
        email: ``,
        state: '',
        hoppy: '',
        desc: '',
        sex: '男',
        start_time: null,
        end_time: null
      }
    }
  },
  mounted () {
    console.log(this.params, this.msDrawer.target)
  },
  methods: {
    fetch () {
      return new Promise((resolve, reject) => {
        setTimeout(resolve(this.params), 2000)
      })
    },
    submit () { // 表单校验通过后调用的方法，一般是请求后台接口的方法
      return new Promise((resolve, reject) => {
        setTimeout(resolve, 1000)
      })
    },
    handleReplaceComponent () {
      ms.navigator.replace(this.msDrawer.target, () => import('./Detail'), {
        title: '详情',
        params: this.params
      })
    },
    handleDetail () {
      console.log('this.params', this.params)
      ms.navigator.push(this.msDrawer.target, () => import('./Detail'), {
        params: this.params
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
