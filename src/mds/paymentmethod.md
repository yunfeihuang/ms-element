# PaymentMethod 支付方式
<e-payment-method v-model="value"></e-payment-method>
<e-payment-method size="small" :options="{wx: 1, zfb: 2}" v-model="value"></e-payment-method>
<e-payment-method size="small" :options="{wx: 1}" readonly></e-payment-method>
value: {{value}}
```html
<template>
<e-payment-method v-model="value"></e-payment-method>
<e-payment-method size="small" :options="{wx: 1, zfb: 2}" v-model="value"></e-payment-method>
<e-payment-method size="small" :options="{wx: 1}" readonly></e-payment-method>
</template>
<script>
  export default {
    data () {
      return {
        value: 1
      }
    }
  }
</script>
```
### Extends
[Element RadioGroup](http://element.eleme.io/#/zh-CN/component/radio)
### Props
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |------------- |--------- |
| options     | 支付方式选项   | Object  |   -       |    {wx: 1, zfb: 2, off: 10}    |
| readonly     | 是否只读状态   | Boolean  |   -       |    false    |

### Events
| 事件名称 | 说明 | 回调参数 |
|---------|--------|---------|
| - | - | - |

### Slots
| 名称 | 说明 |
|---------|--------|
| - | - |
