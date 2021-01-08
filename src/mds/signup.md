# Signup 注册表单
<e-signup :custom-form="{type: '1'}">
  <template slot="prepend" slot-scope="scope">
    <el-form-item label="" prop="type" style="margin-bottom:10px;">
      <el-radio-group v-model="scope.form.type">
        <el-radio label="1">备案代理机构和律所</el-radio>
        <el-radio label="2">非备案律所</el-radio>
      </el-radio-group>
    </el-form-item>
  </template>
  <small slot="argument">《会员注册协议》</small>
  <div slot="links">
    已有帐号？
    <router-link class="link" to="/login">返回登录</router-link>
  </div>
</e-signup>

```html
<template>
  <e-signup>
    <small slot="argument">《会员注册协议》</small>
    <div slot="links">
      已有帐号？
      <router-link class="link" to="/login">返回登录</router-link>
    </div>
  </e-signup>
</template>
<script>
  import 'e-ui/lib/style/theme/signup.scss'
  import ESignup from 'e-ui/lib/signup'
  export default {
    components: {
      ESignup
    }
  }
</script>
```
### Extends
[Signin](/#/signin)
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