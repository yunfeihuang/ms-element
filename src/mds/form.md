# form表单提交
<!--form是必需的命名名称，getFormProps 是form mixin里的方法 返回{model:'form',labelWidth:'141px'} 重写labelWidth: getFormProps({labelWidth:'0px'})-->
<el-form v-bind="getFormProps()" @submit.native.prevent="handleSubmit">
  <!--rules推荐写在html结构-->
  <el-form-item  label="帐号："
    prop="name"
    :rules="[
      { required: true, message: '帐号不能为空'},
      { min: 1, max: 16, message: '帐号不得超过16个字符'}
    ]">
    <el-input v-model.trim="form.name"></el-input>
  </el-form-item>
  <el-form-item  label="密码："
    prop="password"
    :rules="[
      { required: true, message: '密码不能为空'},
      { min: 1, max: 16, message: '密码不得超过16个字符'}
    ]">
    <el-input type="password" v-model.trim="form.password"/>
  </el-form-item>
  <el-form-item label=" ">
    <!--loading是必需在绑定的 native-type="submit"修改button type类型-->
    <el-button type="primary" native-type="submit" :loading="loading">提交</el-button>
    <el-button native-type="reset" >重置</el-button>
  </el-form-item>
</el-form>
    
```html
  <template>
    <!--form是必需的命名名称，getFormProps 是form mixin里的方法 返回{model:'form',labelWidth:'141px'} 重写labelWidth: getFormProps({labelWidth:'0px'})-->
    <el-form v-bind="getFormProps()" @submit.native.prevent="handleSubmit">
      <!--rules推荐写在html结构-->
      <el-form-item  label="帐号："
        prop="name"
        :rules="[
          { required: true, message: '帐号不能为空'},
          { min: 1, max: 16, message: '帐号不得超过16个字符'}
        ]">
        <el-input v-model.trim="form.name"/>
      </el-form-item>
      <el-form-item  label="密码："
        prop="password"
        :rules="[
          { required: true, message: '密码不能为空'},
          { min: 1, max: 16, message: '密码不得超过16个字符'}
        ]">
        <el-input type="password" v-model.trim="form.password"/>
      </el-form-item>
      <el-form-item label=" ">
        <!--loading是必需在绑定的 native-type="submit"修改button type类型-->
        <el-button type="primary" native-type="submit" :loading="loading">提交</el-button>
        <el-button native-type="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </template>
  <script>
    export default {
      mixins: [$mixins.form],
      data () {
        return {
          form: {name: '', password: ''} // 表单字段存储的数据，要以form命名
        }
      },
      methods: {
        submit () { // 提交后台数据
        
        }
      }
    }
  </script>
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
| - | - |
