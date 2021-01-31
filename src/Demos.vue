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
  </ms-frame-layout>
</template>

<script>
export default {
  data () {
    return {
      menus: [
        {
          title: '控制台',
          route: '/'
        },
        {
          title: '用户管理',
          options: [
            {
              route: '/example',
              title: '用户列表'
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
