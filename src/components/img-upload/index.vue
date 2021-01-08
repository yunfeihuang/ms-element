<template>
  <el-tooltip :content="tooltip">
    <upload class="e-img-upload" v-bind="$$props" v-on="$listeners" v-loading="loading" :disabled="loading">
      <template v-if="!$slots.default">
        <img v-if="value" :src="value"/>
        <div v-else class="e-img-upload-placeholder">
          <slot v-if="$slots['icon']" name="icon"></slot>
          <e-icon v-else>&#xe639;</e-icon><br />
          {{placeholder}}
        </div>
      </template>
      <slot v-else v-bind="{value: value}"></slot>
      <i v-if="clearable && value" class="e-img-upload-clearable el-icon-close" @click.stop="handleClear"></i>
    </upload>
  </el-tooltip>
</template>

<script>
import { Upload } from 'element-ui'
export default {
  componentName: 'EImgUpload',
  components: {
    Upload
  },
  computed: {
    $$props () {
      return {
        ...this.$props,
        httpRequest: this.httpMyRequest
      }
    }
  },
  props: {
    ...Upload.props,
    showFileList: {
      type: Boolean,
      default: false
    },
    value: {
      type: String
    },
    action: {
      type: String,
      default: '/api/v1/comm/upload-img'
    },
    placeholder: {
      type: String,
      default: '图片上传'
    },
    tooltip: {
      type: String,
      default: '上传图片仅支持JPG、JPEG、PNG格式且大小不能超过5MB'
    },
    clearable: {
      type: Boolean
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    httpMyRequest (options) {
      let file = options.file
      let params = new FormData() // 创建form对象
      params.append('file', file) // 通过append向form对象添加数据请求头
      this.loading = true
      return this.$axios({
        url: options.action,
        method: 'POST',
        headers: {'Content-Type': 'multipart/form-data'},
        data: params
      }).then(res => {
        this.loading = false
        this.$emit('input', res.data).$emit('change', res.data)
      }).catch(() => {
        this.loading = false
      })
    },
    handleClear () {
      this.$emit('input', '').$emit('change', '')
    }
  }
}
</script>
