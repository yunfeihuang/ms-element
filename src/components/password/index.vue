<template>
  <el-input v-bind="$props" v-on="$listeners" :type="myType">
    <i v-if="lockIcon" slot="prefix" class="el-input__icon e-iconfont" v-html="lockIcon"></i>
    <i slot="suffix"
      class="el-input__icon e-iconfont"
      v-html="myType=='password' ? icons[0] : icons[1]"
      style="cursor:pointer;"
      @click="handleEye">
    </i>
  </el-input>
</template>
<script>
import { Input } from 'element-ui'
export default {
  componentName: 'EPassword',
  props: {
    ...Input.props,
    placeholder: {
      type: String,
      default: '请输入密码'
    },
    type: {
      type: String,
      default: 'password'
    },
    maxlength: {
      type: Number,
      default: 20
    },
    lockIcon: {
      type: String,
      default: '&#xe633;'
    },
    icons: {
      type: Array,
      default () {
        return ['&#xe6d0;', '&#xe622;']
      }
    },
    encrypt: {
      type: Function,
      default1 (value, next) {
        next(value.toUpperCase())
      }
    },
    cipher: {
      type: String
    },
    autocomplete: {
      type: String,
      default: 'new-password'
    }
  },
  data () {
    return {
      myType: this.type
    }
  },
  watch: {
    value (value) {
      if (this.encrypt) {
        let self = this
        let next = (v) => {
          self.$emit('update:cipher', v)
        }
        this.encrypt(value, next)
      }
    }
  },
  methods: {
    handleEye () {
      this.myType = this.myType === 'password' ? 'text' : 'password'
    }
  }
}
</script>
