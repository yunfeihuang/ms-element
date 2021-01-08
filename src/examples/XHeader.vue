<template>
  <header>
    <el-row type="flex" class="wrapper">
      <el-col :span="24">
        <div class="logo">M</div>
        <h2>米沃讯组件文档</h2>
      </el-col>
      <a class="link" target="_blank" href="/demos.html">管理后台示例</a>
    </el-row>
  </header>
</template>

<script>
import logo from '@/assets/images/logo.png'
export default {
  data () {
    return {
      logo
    }
  }
}
</script>
<style lang="scss" scope>
  header{
    div.logo{
      background: #409eff;
      border-radius:10px;
      color:#fff;
      display:inline-block;
      text-align:center;
      width:46px;
      height:46px;
      vertical-align: middle;
      line-height:46px;
      font-size:34px;
      margin: -10px 0;
    }
    h2{
      font-size: 20px;
      margin-left: 10px;
      color: #666;
      font-weight: normal;
    }
    img,h2{
      display:inline-block;
      vertical-align: middle;
    }
    img{
      width:100px;
    }
    .wrapper{
      padding:20px 0;
    }
    &:after{
      display:block;
      content:'';
      height:4px;
      background: #15a9da; /* Old browsers */
      background: -moz-linear-gradient(left, #15a9da 1%, #48c347 27%, #0fa6ea 100%); /* FF3.6-15 */
      background: -webkit-linear-gradient(left, #15a9da 1%,#48c347 27%,#0fa6ea 100%); /* Chrome10-25,Safari5.1-6 */
      background: linear-gradient(to right, #15a9da 1%,#48c347 27%,#0fa6ea 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#15a9da', endColorstr='#0fa6ea',GradientType=1 ); /* IE6-9 */
    }
  }
</style>
