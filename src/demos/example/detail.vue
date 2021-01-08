<template>
  <e-detail-layout>
    <el-breadcrumb slot="breadcrumb">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item to="/example">用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>用户详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!--
    <div>
      <e-developing></e-developing>
    </div>
    -->
    <Detail :query="$route.query"/>
  </e-detail-layout>
</template>

<script>
import Detail from './components/Detail'
export default {
  components: {
    Detail
  },
  methods: {
    handleClick () {
      console.log('handleClick')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
