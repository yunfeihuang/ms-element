<template>
  <ms-frame-layout
    title="后台管理系统"
    :menus="menus">
    <template slot="logo" slot-scope="scope">
      <i :style="`font-size:${scope.isCollapse?14:26}px;font-style:normal;`">LOGO</i>
    </template>
    <div slot="nav" class="actions">
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
