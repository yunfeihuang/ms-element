<template>
  <div id="app">
    <ms-frame-layout
      title="designer"
      :menus="menus"
      :menuProps="menuProps">
      <template v-slot:logo="scope">
        <i :style="`font-size:${scope.isCollapse?14:26}px;font-style:normal;`">designer</i>
      </template>
      <div slot="nav"></div>
      <template v-slot="scope">
        <keep-alive :include="scope.include">
          <router-view class="ms-frame-layout--slot ms-scroller" v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view class="ms-frame-layout--slot ms-scroller" v-if="!$route.meta.keepAlive"></router-view>
      </template>
      <div v-if="$route.path=='/'" slot="sub" class="sub">
        <div class="sub-item" @click="$root.$emit('setting')">
          <i class="el-icon-setting"></i>
          <small>设置</small>
        </div>
        <div class="sub-item" @click="$root.$emit('create-column')">
          <i class="el-icon-plus"></i>
          <small>创建列</small>
        </div>
        <div class="sub-item" @click="$root.$emit('preview')">
          <i class="el-icon-view"></i>
          <small>预览</small>
        </div>
        <div class="sub-item" @click="$root.$emit('import')">
          <i class="el-icon-download"></i>
          <small>导入</small>
        </div>
        <div class="sub-item" @click="$root.$emit('export')">
          <i class="el-icon-upload2"></i>
          <small>导出</small>
        </div>
      </div>
    </ms-frame-layout>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menuProps: {},
      menus: [
        {
          iconClass: 'el-icon-monitor',
          title: '设计首页',
          route: '/'
        },
        {
          title: '用户管理',
          route: '/user'
        }
      ]
    }
  },
  methods: {
    handleThemeChange () {
      if (this.menuProps && !this.menuProps.backgroundColor) {
        this.menuProps = {
          backgroundColor: '#333',
          textColor: '#fff',
          activeTextColor: '#ffd04b'
        }
      } else {
        this.menuProps = {}
      }
    }
  }
}
</script>
<style lang="scss">
  .ms-loading-element{
    position: relative;
  }
  .sub{
    background:#fff;
    width:56px;
    margin: 10px;
    margin-right:0;
    text-align: center;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    padding:1px 0;
    &-item{
      margin:15px 0;
      cursor: pointer;
      i{
        display: block;
        font-size: 24px;
      }
      small{
        font-size:12px;
      }
    }
  }
</style>
