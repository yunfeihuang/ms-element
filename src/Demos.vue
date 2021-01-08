<template>
  <e-frame-layout
    title="后台管理系统"
    :menus="menus">
    <template slot="logo" slot-scope="scope">
      <i :style="`font-size:${scope.isCollapse?14:26}px;font-style:normal;`">LOGO</i>
    </template>
    <div slot="nav">
      <div class="e-frame-layout--nav-item">
        <span class="e-frame-layout--nav-trigger">
          admin
        </span>
      </div>
      <div class="e-frame-layout--nav-item">
        <span class="e-frame-layout--nav-trigger">
          退出
        </span>
      </div>
    </div>
    <router-view></router-view>
  </e-frame-layout>
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
</style>
