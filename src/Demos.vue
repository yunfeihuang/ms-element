<template>
  <ms-frame-layout
    title="后台管理系统"
    :menus="menus">
    <template slot="logo" slot-scope="scope">
      <i :style="`font-size:${scope.isCollapse?14:26}px;font-style:normal;`">LOGO</i>
    </template>
    <router-view></router-view>
  </ms-frame-layout>
</template>

<script>
import MsFrameLayout from '@/ms/frame-layout'
export default {
  components: {
    MsFrameLayout
  },
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
</style>
