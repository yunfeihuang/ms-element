# Signin 登录表单
<e-signin>
  <div slot="links">
    还没有注册账号？
    <router-link to="/signup" class="link">立即注册</router-link> ｜ 
    <router-link to="/find-password" class="link">忘记密码</router-link>
  </div>
</e-signin>

```html
<template>
  <e-signin>
    <div slot="links">
      还没有注册账号？
      <router-link to="/signup" class="link">立即注册</router-link> ｜ 
      <router-link to="/find-password" class="link">忘记密码</router-link>
    </div>
  </e-signin>
</template>
<script>
  import 'e-ui/lib/style/theme/signin.scss'
  import ESignin from 'e-ui/lib/signin'
  export default {
    components: {
      ESignin
    }
  }
</script>
```

### Props
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |------------- |--------- |
| title     | 登录标题   | String  |   -       |    用户登录    |
| accountProps     | 帐号输入框props   | Object  |   -       |    -    |
| accountType     | 帐号类型   | Array  |   -       |    ['email', 'mobile']   |
| passwordProps     | 密码输入框props   | Object  |   -       |    -    |
| codeProps     | 验证码输入框props   | Object  |   -       |    -    |
| action     | 登录提交action   | String  |   -       |    /signin    |
| submitText     | 登录按钮文本   | String  |   -       |    立即登录    |
| accpetText     | 我已阅读并接受文本   | String  |   -       |    我已阅读并接受    |

### Events
| 事件名称 | 说明 | 回调参数 |
|---------|--------|---------|
| success | 表单提交成功事件 | res |
| error | 表单提交失败事件 | res |

### Slots
| 名称 | 说明 | 
|---------|--------|
| title | 标题 |
| links | 底部链接 |
| argument | 协议 |