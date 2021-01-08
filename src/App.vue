<template>
  <div class="frame-docs">
    <x-header/>
    <div class="wrapper">
      <el-row :gutter="20">
        <el-col :span="5">
          <!--
          <el-scrollbar wrap-class="sidebar-scrollbar-wrap">
            <sidebar/>
          </el-scrollbar>
          -->
          <sidebar/>
        </el-col>
        <el-col :span="19">
          <div class="markdown-body">
            <router-view></router-view>
          </div>
        </el-col>
      </el-row>
    </div>
    <x-footer/>
  </div>
</template>

<script>
import XHeader from './examples/XHeader'
import XFooter from './examples/XFooter'
import Sidebar from './examples/Sidebar'
// import markdown from './markdown.md'
// import 'highlight.js/styles/github.css'
// import 'github-markdown-css'

export default {
  components: {
    XHeader,
    XFooter,
    Sidebar
  },
  mounted () {
    window.onhashchange = () => {
      let scrollTop = document.body.scrollTop = document.documentElement.scrollTop
      if (scrollTop > 86) {
        document.body.scrollTop = document.documentElement.scrollTop = 86
      }
    }
    // this.$el.querySelector('.sidebar-scrollbar-wrap').style.height = window.innerHeight - 112 + 'px'
  }
}
</script>
<style lang="scss">
  .frame-docs{
    .sidebar-scrollbar-wrap{
      height: 430px;
      overflow-y: scroll;
      position:fixed;
      width:100%;
    }
    .wrapper{
      width:1200px;
      margin: 0 auto;
    }
    >.wrapper{
      margin: 20px auto;
    }
  }
  .markdown-body {
    code{
      font-size: 12px;
      padding: 18px 24px;
      background-color: #fafafa;
      border: 1px solid #eaeefb;
      margin-bottom: 25px;
      border-radius: 4px;
      -webkit-font-smoothing: auto;
      display: block;
    }
    a{
      color:$--color-primary;
    }
    h1,h2,h3,h4,h5,h6{
      font-weight:normal;
      margin:15px 0;
      line-height:1;
    }
    h1{
      font-size:20px;
    }
    h2{
      font-size:18px;
    }
    h3{
      font-size:16px;
    }
    h4{
      font-size:14px;
    }
    h5{
      font-size:12px;
    }
    h6{
      font-size:12px;
      color:$--color-text-secondary;
    }
    hr{
      margin: 15px 0;
    }
    table{
      width:100%;
      text-align: left;
      td, th{
        border-bottom:1px solid #f5f5f5;
        padding:8px;
      }
    }
    pre{
      margin:10px 0;
    }
  }
</style>
