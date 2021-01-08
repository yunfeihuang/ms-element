# 数字区间
<e-input-number-range v-model="value"></e-input-number-range>
<e-input-number-range v-model="value" size="small"></e-input-number-range>
```html
<template>
  <e-input-number-range v-model="value"/>
  <e-input-number-range v-model="value" size="small"/>
</template>
<script>
  export default {
    data () {
      return {
        value: [0, 0]
      }
    }
  }
</script>
```

### Extends
[Element InputNumber](http://element.eleme.io/#/zh-CN/component/input-number)

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