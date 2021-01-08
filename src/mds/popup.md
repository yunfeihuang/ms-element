# popup弹框层
<div>
  <detail-popup title="详情"></detail-popup>
  <create-form-popup title="创建"></create-form-popup>
  <el-button type="primary" size="mini" @click="pushOpen('detail')">打开详情弹框</el-button>
  <el-button type="primary" size="mini" @click="pushOpen('create')">打开表单弹框</el-button>
</div>

```html
 <template>
  <div>
    <detail-popup title="详情"></detail-popup>
    <create-form-popup title="创建"></create-form-popup>
    <el-button type="primary" size="mini" @click="pushOpen('detail')">打开详情弹框</el-button>
    <el-button type="primary" size="mini" @click="pushOpen('create')">打开表单弹框</el-button>
  </div>
</template>
<script>
const DetailPopup = $mixins.popupManager.$('detail', () => import('@/demos/PopupDetail'))
const CreateFormPopup = $mixins.popupManager.$('create', () => import('@/demos/PopupForm'))

export default {
  mixins: [$mixins.popupManager], // 必须引入popupManager mixins
  components: {
    DetailPopup,
    CreateFormPopup
  }
}
</script>
```
/demos/PopupDetail文件代码
```
<template>
  <div>
    详情内容...
  </div>
</template>

<script>
export default {
  data () {
    return {
      detail: {}
    }
  },
  methods: {
    handleBackIn () { // 关闭前一个弹框后进到当前弹框被触发
      console.log('handleBackIn')
    },
    fetch () { // 必须要返回axios promise
      /*
      if (this.query) {
        return this.$axios({
          url: `/v1/detail/${query}`
        }).then(res => {
          this.detail = res.data
        })
      }
      */
    }
  }
}
</script>

```
/demos/PopupForm文件代码
```
<template>
  <el-form v-bind="getFormProps()" @submit.native.prevent="handleSubmit">
    <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '请输入活动名称' }]">
      <el-input v-model.trim="form.name"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password" :rules="[
      {required: true, message: '请输入密码'}
      ]">
      <el-input v-model.trim="form.password" type="password"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email" :rules="[
      {required: true, message: '请输入邮箱'},
      validator.rule.email
      ]">
      <el-input v-model.trim="form.email"></el-input>
    </el-form-item>
    <el-form-item label="类别">
      <el-radio-group v-model="form.role">
        <el-radio label="超级"></el-radio>
        <el-radio label="保险公司"></el-radio>
        <el-radio label="快递企业"></el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        role: ''
      }
    }
  },
  methods: {
    fetch () { // 必须要返回axios promise
      /*
      if (this.query) {
        return this.$axios({
          url: `/v1/account/${this.query.id}`
        }).then(res => {
          Object.assign(this.form, res.data)
        })
      }
      */
    },
    submit () {
      /*
      return this.$axios({
        url: this.query ? `/v1/account/${this.query.id}` : '/v1/account',
        method: this.query ? 'PUT' : 'POST',
        data: this.form,
        options: {
          context: this
        }
      })
      */
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
