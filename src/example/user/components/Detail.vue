<template>
  <!--v-bind="getFormProps()" @submit.native.prevent="handleSubmit"是必须的-->
  <el-form class="form-primary" label-width="6rem">
    <el-form-item label="头像：" style="margin-bottom:0">
      <img :src="res.url" class="img-size-large">
    </el-form-item>
    <el-form-item label="姓名：" style="margin-bottom:0">
      {{res.name}}
    </el-form-item>
    <el-form-item label="性别：" style="margin-bottom:0">
      {{res.sex}}
    </el-form-item>
    <el-form-item label="年龄：" style="margin-bottom:0">
      {{res.age}}
    </el-form-item>
    <el-form-item label="邮箱：" style="margin-bottom:0">
      {{res.email}}
    </el-form-item>
    <el-form-item label="状态：" style="margin-bottom:0">
      {{res.state}}
    </el-form-item>
    <el-form-item label="工作时间：" style="margin-bottom:0">
      {{res.start_time}}~{{res.end_time}}
    </el-form-item>
    <el-form-item label="地址：" style="margin-bottom:0">
      {{res.address}}
    </el-form-item>
    <el-form-item label="兴趣爱好：" style="margin-bottom:0">
      {{res.hoppy}}
    </el-form-item>
    <el-form-item label="个人介绍：" style="margin-bottom:0">
      {{res.desc}}
    </el-form-item>
    <el-form-item v-if="this.msDrawer" label="" style="margin-bottom:0">
      <el-button type="text" @click="handleClose">关闭当前弹框</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  mixins: [ms.mixins.fetch],
  methods: {
    fetch () {
      return new Promise((resolve, reject) => {
        setTimeout(resolve(this.params || this.$attrs.params), 2000)
      })
    },
    handleClose () {
      this.msDrawer && ms.navigator.pop(this.msDrawer.target)
    }
  },
  mounted () {
    console.log('detail', this)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
