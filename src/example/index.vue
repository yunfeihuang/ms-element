<template>
  <ms-frame-layout
    title="后台管理系统"
    :menus="menus"
    :menuProps="menuProps">
    <template slot="logo" slot-scope="scope">
      <i :style="`font-size:${scope.isCollapse?14:26}px;font-style:normal;`">LOGO</i>
    </template>
    <div slot="nav" class="actions">
      <span @click="handleThemeChange">切换主题色</span>
      <router-link to="/profile">个人中心</router-link>
      <router-link to="/message">消息</router-link>
    </div>
    <router-view class="ms-frame-layout--slot ms-scroller"></router-view>
  </ms-frame-layout>
</template>

<script>
export default {
  data () {
    return {
      menuProps: {},
      menus: [
        {
          iconClass: 'el-icon-monitor',
          title: '控制台',
          route: '/'
        },
        {
          title: '用户管理',
          options: [
            {
              route: '/user',
              title: '用户列表'
            },
            {
              route: '/user2',
              title: '用户列表2'
            }
          ]
        }
      ]
    }
  },
  methods: {
    handleThemeChange () {
      debugger
      if (this.menuProps && !this.menuProps.backgroundColor) {
        this.menuProps = {
          backgroundColor: '#545c64',
          textColor:'#fff',
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
