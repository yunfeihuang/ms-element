<template>
  <!--v-bind="getFormProps()" @submit.native.prevent="handleSubmit"是必须的-->
  <el-form class="form-primary" label-width="6rem" v-if="response">
    <el-form-item label="头像：" style="margin-bottom:0">
      <img :src="response.url" class="img-size-large">
    </el-form-item>
    <el-form-item label="姓名：" style="margin-bottom:0">
      {{response.name}}
    </el-form-item>
    <el-form-item label="性别：" style="margin-bottom:0">
      {{response.sex}}
    </el-form-item>
    <el-form-item label="年龄：" style="margin-bottom:0">
      {{response.age}}
    </el-form-item>
    <el-form-item label="邮箱：" style="margin-bottom:0">
      {{response.email}}
    </el-form-item>
    <el-form-item label="状态：" style="margin-bottom:0">
      {{response.state}}
    </el-form-item>
    <el-form-item label="工作时间：" style="margin-bottom:0">
      {{response.start_time}}~{{response.end_time}}
    </el-form-item>
    <el-form-item label="地址：" style="margin-bottom:0">
      {{response.address}}
    </el-form-item>
    <el-form-item label="兴趣爱好：" style="margin-bottom:0">
      {{response.hoppy}}
    </el-form-item>
    <el-form-item label="个人介绍：" style="margin-bottom:0">
      {{response.desc}}
    </el-form-item>
    <el-form-item v-if="this.msDrawer" label="" style="margin-bottom:0">
      <el-button type="text" @click="handleClose">关闭当前弹框</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import ms from 'ms-element/ms'
export default {
  mixins: [ms.mixins.fetch],
  methods: {
    fetch () {
      return new Promise((resolve) => {
        setTimeout(resolve(this.params || this.$attrs.params || {}), 2000)
      })
    },
    handleClose () {
      this.$emit('close')
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
