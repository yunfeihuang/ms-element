# FrameLayout结构布局

```
<template>
  <e-frame-layout>
    <div slot="aside">aside</div>
    <div slot="logo">logo</div>
    <div slot="header">header</div>
    <div>default</div>
  </e-frame-layout>
</template>
```

### Props
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |------------- |--------- |
| title     | 标题   | -  |   -       |    -    |
| menus     | 左侧菜单数组，使用的是el-menu   | -  |   -       |    -    |
| menusProps     | el-menu props   | -  |   -       |    -    |
| iconClass     | 左侧菜单icon class   | -  |   -       |    iconfont    |

### Events
| 事件名称 | 说明 | 回调参数 |
|---------|--------|---------|
| - | - | - |

### Slots
| 名称 | 说明 | 
|---------|--------|
| default | - |
| title | - |
| aside | - |
| header | - |