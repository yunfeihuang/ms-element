<template>
  <div class="e-signup">
    <el-form ref="form" :model="form" @submit.native.prevent="handleSubmit">
      <legend v-if="!$slots.title">{{title}}</legend>
      <slot name="title" v-else></slot>
      <slot name="prepend" v-bind="{form: form}"></slot>
      <el-form-item prop="account" :rules="[
        {required: true, message: placeholder}
        ]">
        <el-input v-model.trim="form.account" v-bind="accountProps" :placeholder="placeholder">
          <e-icon v-if="accountType.length==1&&accountType.indexOf('email')>-1" slot="prefix" class="el-input__icon">&#xe619;</e-icon>
          <e-icon v-else-if="accountType.length==1&&accountType.indexOf('mobile')>-1" slot="prefix" class="el-input__icon">&#xe67e;</e-icon>
          <e-icon v-else slot="prefix" class="el-input__icon">&#xe604;</e-icon>
        </el-input>
      </el-form-item>
      <el-form-item prop="code" :rules="[
        {required: true, message: '请输入验证码'}
        ]">
        <e-email-code :to="form.account" v-if="isEmail" v-bind="emailCodeProps"></e-email-code>
        <e-sms-code :to="form.account" v-bind="smsCodeProps" v-else v-model.trim="form.code"/>
      </el-form-item>
      <el-form-item prop="password" :rules="passwordRules">
        <e-password v-model.trim="form.password" v-bind="passwordProps"/>
      </el-form-item>
      <slot name="append" v-bind="{form: form}"></slot>
      <el-form-item class="is-argument" v-if="$slots.argument" prop="argument">
        <el-checkbox v-model="form.argument">
          <small>{{accpetText}}</small>
        </el-checkbox>
        <slot name="argument"></slot>
      </el-form-item>
      <div v-if="errorMessage" class="el-form-item__error e-signup-error">
        <el-alert :closable="false" :title="errorMessage" type="error" show-icon></el-alert>
      </div>
      <el-button type="primary" :disabled="!form.argument" :loading="loading" native-type="submit">{{submitText}}</el-button>
    </el-form>
    <div class="e-signup-links" v-if="$slots.links">
      <slot name="links"></slot>
    </div>
  </div>
</template>
<script>
import form from '@/mixins/form'
export default {
  componentName: 'ESignup',
  mixins: [form],
  props: {
    title: {
      type: String,
      default: '用户注册'
    },
    accountType: {
      type: Array,
      default () {
        return ['mobile', 'email']
      }
    },
    accountProps: {
      type: Object
    },
    passwordProps: {
      type: Object,
      default () {
        return {
          placeholder: '请设置密码'
        }
      }
    },
    emailCodeProps: {
      type: Object
    },
    smsCodeProps: {
      type: Object
    },
    accountRules: {
      type: Array,
      default () {
        return []
      }
    },
    passwordRules: {
      type: Array,
      default () {
        return [
          {required: true, message: '请设置密码'},
          {min: 6, message: '密码不能小于6个字符'},
          {pattern: /^[a-zA-Z0-9_]+$/, message: '密码格式不正确,必须是数字或者字母'}
        ]
      }
    },
    submitText: {
      type: String,
      default: '立即注册'
    },
    action: {
      type: String
    },
    customForm: {
      type: Object
    },
    onSubmit: {
      type: Function
    },
    accpetText: {
      type: String,
      default: '我已阅读并接受'
    }
  },
  computed: {
    placeholder () {
      let tmp = {
        mobile: '手机号',
        email: '邮箱'
      }
      let names = this.accountType.map(item => {
        return tmp[item]
      })
      return `请输入${names.join('/')}`
    },
    isEmail () {
      return /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(this.form.account)
    }
  },
  data () {
    return {
      loading: false,
      errorMessage: '',
      form: {
        ...this.customForm,
        account: '',
        password: '',
        code: '',
        argument: true
      }
    }
  },
  methods: {
    submit () {
      if (this.action) {
        this.loading = true
        this.$axios({
          url: this.action,
          method: 'POST',
          data: JSON.parse(JSON.stringify(this.form))
        }).then(res => {
          this.loading = false
          this.$emit('success', res)
        }).catch(res => {
          this.loading = false
          this.$emit('error', res)
          this.errorMessage = res.msg
          this.$refs.imgCode && this.$refs.imgCode.refresh()
        })
      } else if (this.onSubmit) {
        this.loading = true
        this.onSubmit(JSON.parse(JSON.stringify(this.form)), this).then(res => {
          this.loading = false
          this.$emit('success', res)
        }).catch(res => {
          this.loading = false
          this.$emit('error', res)
          this.errorMessage = res.msg
          this.$refs.imgCode && this.$refs.imgCode.refresh()
        })
      } else {
        this.$emit('success')
      }
    }
  }
}
</script>
