<template>
  <div id="app" v-if="$route && $route.path">
    <el-config-provider :locale="locale">
      <el-row type="flex" tag="header" align="middle" style="padding:10px;">
        <div style="flex:1">
          <h2>Ms Element</h2>
        </div>
        <el-link type="primary" target="_blank" href="https://github.com/yunfeihuang/ms-element">github</el-link>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="4">
          <div v-for="(item,index) in navConfig" :key="index" style="padding-left:20px;line-height:2">
            <template v-if="item.children">
              <h4>{{item.title}}</h4>
              <router-link v-for="(childItem,childIndex) in item.children" class="el-link el-link--primary" :to="childItem.path" :key="childIndex">{{childItem.title}}</router-link>
            </template>
            <router-link style="font-weight:bold;" v-else class="el-link el-link--primary" :to="item.path" >{{item.title}}</router-link>
          </div>
        </el-col>
        <el-col :span="20">
          <div class="markdown-body">
            <router-view></router-view>
          </div>
        </el-col>
      </el-row>
    </el-config-provider>
  </div>
</template>

<script>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import navConfig from './nav.config'

export default {
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
  },
  data() {
    return {
      locale: zhCn,
      navConfig
    }
  }
}
</script>
<style lang="scss">
  body{
    margin:0;
    font-size:14px;
  }
  header{
    position:sticky;
    top:0;
    left:0;
    width:100%;
    border-bottom: 1px solid #eee;
    background: #fff;
    z-index:101;
    h2{
      font-size: 20px;
      margin-left: 20px;
      color: #666;
      font-weight: normal;
    }
    img,h2{
      display:inline-block;
      vertical-align: middle;
      margin:0
    }
    img {
      width:35px;
      height:35px;
      margin-right:10px;
    }
    .header-inner{
      padding:10px;
    }
  }
</style>
