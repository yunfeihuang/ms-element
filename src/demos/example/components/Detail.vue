<template>
  <!--v-bind="getFormProps()" @submit.native.prevent="handleSubmit"是必须的-->
  <el-form class="form-primary" label-width="6rem">
    <el-form-item label="头像：" style="margin-bottom:0">
      <img :src="detail.url" class="img-size-large">
    </el-form-item>
    <el-form-item label="姓名：" style="margin-bottom:0">
      {{detail.name}}
    </el-form-item>
    <el-form-item label="性别：" style="margin-bottom:0">
      {{detail.sex}}
    </el-form-item>
    <el-form-item label="年龄：" style="margin-bottom:0">
      {{detail.age}}
    </el-form-item>
    <el-form-item label="邮箱：" style="margin-bottom:0">
      {{detail.email}}
    </el-form-item>
    <el-form-item label="状态：" style="margin-bottom:0">
      {{detail.state}}
    </el-form-item>
    <el-form-item label="工作时间：" style="margin-bottom:0">
      {{detail.start_time}}~{{detail.end_time}}
    </el-form-item>
    <el-form-item label="地址：" style="margin-bottom:0">
      {{detail.address}}
    </el-form-item>
    <el-form-item label="兴趣爱好：" style="margin-bottom:0">
      {{detail.hoppy}}
    </el-form-item>
    <el-form-item label="个人介绍：" style="margin-bottom:0">
      {{detail.desc}}
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    query: {
      type: Object
    }
  },
  data () {
    return {
      detail: {
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
    if (this.query) {
      Object.assign(this.detail, this.query)
    }
  },
  methods: {
    fetch () {
      if (this.query) {
        Object.assign(this.detail, this.query)
      }
      return new Promise((resolve, reject) => {
        setTimeout(resolve, 1000)
      })
      /*
      if (this.query) {
        return this.$axios({
          url: `/v1/account/${this.query.id}`
        }).then(res => {
          this.detail = res.data
        })
      }
      */
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
