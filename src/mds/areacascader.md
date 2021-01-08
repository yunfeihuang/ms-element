# AreaCascader 地区
省市区：<e-area-cascader v-model="value" :label.sync="label"></e-area-cascader>
省市：<e-area-cascader v-model="value" :label.sync="label" format="P-C"></e-area-cascader>
value: {{value}} label：{{label}}
```html
<template>
  省市区：<e-area-cascader v-model="value"></e-area-cascader>
  省市：<e-area-cascader v-model="value" :label.sync="label" format="P-C"></e-area-cascader>
  value: {{value}} label：{{label}}
</template>
<script>
  export default {
    data () {
      return {
        value: ['1', '36', '38'],
        label: []
      }
    }
  }
</script>
```

### Extends
[Element Cascader](http://element.eleme.io/#/zh-CN/component/cascader)

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
| - | - |