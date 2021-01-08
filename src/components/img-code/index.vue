<template>
  <el-input v-bind="$props" v-on="$listeners" :action="null" :params="null">
    <e-icon slot="prefix" class="el-input__icon">&#xe676;</e-icon>
    <el-button type="text" slot="suffix" style="height:100%;padding:0;" title="看不清楚？点击可以更换图片" @click="handle">
      <img v-if="src" :src="src" />
      <e-icon v-else style="font-size:30px">&#xe62b;</e-icon>
    </el-button>
  </el-input>
</template>

<script>
import { Input } from 'element-ui'
export default {
  componentName: 'EImgCode',
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
      default: 60000
    },
    action: {
      type: String
    }
  },
  data () {
    return {
      loading: false,
      src: ''
    }
  },
  methods: {
    handle () {
      if (this.action) {
        let options = {
          url: this.action,
          params: Object.assign({randomKey: '', validateCode: ''}, this.params),
          options: {context: this}
        }
        this.$axios(options).then(res => {
          this.src = res.data
        })
      }
    }
  }
}
</script>
