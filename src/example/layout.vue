<template>
  <ms-frame-layout
    title="后台管理系统"
    :menus="menus"
    :menuProps="menuProps">
    <template v-slot:logo="scope">
      <i :style="`font-size:${scope.isCollapse?14:26}px;font-style:normal;`">LOGO</i>
    </template>
    <div slot="nav" class="actions">
      <span @click="handleThemeChange">切换菜单栏颜色</span>
      <router-link to="/profile">个人中心</router-link>
      <router-link to="/message">消息</router-link>
    </div>
    <template v-slot="scope">
      <keep-alive :include="scope.include">
        <router-view class="ms-frame-layout--slot ms-scroller" v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view class="ms-frame-layout--slot ms-scroller" v-if="!$route.meta.keepAlive"></router-view>
    </template>
  </ms-frame-layout>
</template>

<script>
export default {
  mixins: [ms.mixins.fetch]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
