<template>
  <el-input v-bind="$props" v-on="$listeners" :action="null" :params="null">
    <e-icon slot="prefix" class="el-input__icon">&#xe600;</e-icon>
    <el-button
      slot="suffix"
      size="mini"
      type="text"
      style="height: 100%;margin-right:5px;"
      :disabled="btnDisabled || counter > 0"
      :loading="loading"
      @click="handleFetch">
      {{counter > 0 ? `重新发送(${counter})` : '获取验证码'}}
    </el-button>
  </el-input>
</template>

<script>
import { Input } from 'element-ui'
export default {
  componentName: 'EEmailCode',
  props: {
    ...Input.props,
    placeholder: {
      type: String,
      default: '请输入验证码'
    },
    maxlength: {
      type: Number,
      default: 6
    },
    btnDisabled: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 60000 * 5
    },
    action: {
      type: String
    },
    to: {
      type: String
    }
  },
  data () {
    return {
      loading: false,
      isSend: false,
      counter: 0
    }
  },
  methods: {
    sendSuccess () {
      this.loading = false
      this.isSend = true
      this.counter = this.duration / 1000
      this.$interval = setInterval(() => {
        this.counter = this.counter - 1
      }, 1000)
    },
    handleFetch () {
      if (this.to) {
        if (this.action && !this.onSubmit) {
          let options = {
            url: this.action,
            params: Object.assign({to: this.to}, this.params),
            options: {context: this}
          }
          this.$axios(options).then(this.sendSuccess).catch(() => {
            this.loading = false
          })
        } else if (this.onSubmit) {
          this.onSubmit(Object.assign({to: this.to}, this.params), this).then(res => {
            this.sendSuccess()
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.sendSuccess()
        }
      } else {
        this.$message && this.$message({type: 'error', message: '请输入邮箱地址'})
      }
    }
  }
}
</script>
