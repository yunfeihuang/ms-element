# PageListLayout结构布局

```
<template>
  <e-page-list-layout>
    <div slot="breadcrumb">breadcrumb area</div>
    <div slot="search">search area</div>
    <div slot="table">table area</div>
    <div slot="pagination">pagination area</div>
  </e-page-list-layout>
</template>
```

### Props
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |------------- |--------- |
| -     | -   | -  |   -       |    -    |

### Events
| 事件名称 | 说明 | 回调参数 |
|---------|--------|---------|
| - | - | - |

### Slots
| 名称 | 说明 | 
|---------|--------|
| breadcrumb | 列表面包屑 |
| search | 列表搜索 |
| table | 列表表格 |
| pagination | 列表分页（有默认值） |