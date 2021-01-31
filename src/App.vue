<template>
  <div class="frame-docs">
    <header>
      <el-row type="flex" class="wrapper">
        <el-col :span="24">
          <div class="logo">M</div>
          <h2>米沃讯组件文档</h2>
        </el-col>
        <a class="link" target="_blank" href="/demos.html">管理后台示例</a>
      </el-row>
    </header>
    <div class="wrapper">
      <el-row :gutter="20">
        <el-col :span="5">
          <aside>
            <div v-for="(item,index) in navConfig" :key="index">
              <template v-if="item.children">
                <h4>{{item.title}}</h4>
                <router-link v-for="(childItem,childIndex) in item.children" class="nav-link" :to="childItem.path" :key="childIndex">{{childItem.title}}</router-link>
              </template>
              <router-link style="font-weight:bold;" v-else class="nav-link" :to="item.path" >{{item.title}}</router-link>
            </div>
          </aside>
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
// import markdown from './markdown.md'
// import 'highlight.js/styles/github.css'
// import 'github-markdown-css'
import navConfig from './nav.config'
export default {
  data () {
    return {
      navConfig
    }
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
<style lang="scss" scoped>
  aside{
    line-height:1;
    h4{
      margin-top:15px;
      margin-bottom:2px;
      font-size:12px;
      color:$--color-text-secondary;
      font-weight: normal;
    }
    a{
      display:block;
      color:#666;
      padding:10px 0;
      &:hover{
        color:$--color-primary;
      }
      &.router-link-exact-active{
        color:$--color-primary;
        font-weight: bold;
      }
    }
  }
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
