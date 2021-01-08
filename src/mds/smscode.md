# 短信验证码

### 注意：需要在webpack.base.conf.js

<e-sms-code v-model="value" :params="{account: '15889750621', type: 4, extisted: true}" ></e-sms-code>
```html
<template>
  <div>
  <e-sms-code v-model="value" :params="{account: '15889750621', type: 4, extisted: true}" />
  </div>
</template>
<script>
  export default {
    data () {
      return {
        value: ''
      }
    }
  }
</script>
```
### Extends
[Element Input](http://element.eleme.io/#/zh-CN/component/input)

### Props
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |------------- |--------- |
| action     |  请求图片接口地址  | string  |   -       |    -    |
| params     |  请求图片接口参数  | object  |   -       |    -    |
| btnDisabled     | 控制获取短信验证码按键的禁用状态   | boolean  |   -       |    false   |
| duration     | 发微信后多少毫秒才能重试   | number  |   -       |    60000    |

### Events
| 事件名称 | 说明 | 回调参数 |
|---------|--------|---------|
| - | - | - |

### Slots
| 名称 | 说明 | 
|---------|--------|
| - | - |