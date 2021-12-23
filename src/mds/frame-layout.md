# FrameLayout结构布局

```
<template>
  <ms-frame-layout
    title="后台管理系统"
    :menu="menu"
    :menuProps="menuProps">
    <template v-slot:logo="scope">
      <i :style="`font-size:${scope.isCollapse?14:26}px;font-style:normal;`">LOGO</i>
    </template>
    <template #navbar-menu>
      <router-link to="/profile">个人中心</router-link>
      <router-link to="/message">消息</router-link>
    </template>
  </ms-frame-layout>
</template>
```

### Props
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |------------- |--------- |
| title     | 标题   | -  |   -       |    -    |
| menus    | 左侧菜单数组，使用的是el-menu   | -  |   -       |    -    |
| menusProps     | el-menu props   | -  |   -       |    -    |
| iconClass     | 左侧菜单icon class   | -  |   -       |    iconfont    |
| isTabs     | 是否显示页面选项卡   | -  |   -       |    true    |
| defaultRoute     | 默认路由   | -  |   -       |    /    |
| keepAliveExclude     | keepalive exclude属性，用于控制是否缓存页面   | -  |   -       |    -    |
| asideCollapse     | 左侧边框是否展开   | -  |   -       |    true    |



### Events
| 事件名称 | 说明 | 回调参数 |
|---------|--------|---------|
| - | - | - |

### Slots
| 名称 | 说明 | 
|---------|--------|
| default | - |
| title | - |
| memu | - |
| navbar | - |
| navbar-submenu | - |
| subbar | - |
