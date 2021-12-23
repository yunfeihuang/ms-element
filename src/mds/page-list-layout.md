# PageListLayout结构布局

```
<template>
  <ms-page-list-layout>
    <template v-slot:breadcrumb>breadcrumb area</template>
    <template v-slot:tabs>tab area</template>
    <template v-slot:breadcrumb>search area</template>
    <template v-slot:table>table area</template>
    <template v-slot:pagination>pagination area</template>
  </ms-page-list-layout>
</template>
```

### Props
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |------------- |--------- |
| breadcrumbTeleportTo     | -   | -  |   -       |    -    |

### Events
| 事件名称 | 说明 | 回调参数 |
|---------|--------|---------|
| - | - | - |

### Slots
| 名称 | 说明 | 
|---------|--------|
| breadcrumb | 列表面包屑 |
| tabs | 选项卡 |
| search | 列表搜索 |
| table | 列表表格 |
| pagination | 列表分页（有默认值） |