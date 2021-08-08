<template>
  <div id="app">
    <ms-frame-layout
      title="designer"
      :menus="menus"
      :menuProps="menuProps">
      <template v-slot:logo="scope">
        <i :style="`font-size:${scope.isCollapse?14:26}px;font-style:normal;`">designer</i>
      </template>
      <div slot="nav" class="actions">
      </div>
      <template v-slot="scope">
        <keep-alive :include="scope.include">
          <router-view class="ms-frame-layout--slot ms-scroller" v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view class="ms-frame-layout--slot ms-scroller" v-if="!$route.meta.keepAlive"></router-view>
      </template>
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
  .actions{
    a{
      margin-right:10px;
    }
  }
</style>
