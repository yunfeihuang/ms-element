<template>
  <el-drawer
    v-bind="drawer"
    :visible="visible"
    @close="handleClose"
    @opened="handleOpened"
    @closed="handleClosed">
    <div class="ms-drawer--layout">
      <div class="ms-drawer--body scroller">
        <component
          ref="component"
          :is="component"
          v-bind="props"
          @hook:mounted="handleMounted"
        />
      </div>
      <div class="ms-drawer--footer">
        <el-button
          type="primary"
          size="small"
          nativeType="button"
          @click="handleSubmit">
          {{confirmText}}
        </el-button>
        <el-button
          size="small"
          nativeType="button"
          @click="handleReset">
          {{resetText}}
        </el-button>
        <el-button
          size="small"
          nativeType="button"
          @click="handleClose">
          {{cancelText}}
        </el-button>
      </div>
    </div>
    <div v-if="loading" class="el-loading-mask ms-drawer--mask">
      <div class="el-loading-spinner">
        <svg viewBox="25 25 50 50" class="circular">
          <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
        </svg>
      </div>
    </div>
    <div class="ms-drawer--resize" @mousedown.prevent="handleMouseDown"/>
  </el-drawer>
</template>

<script>
export default {
  props: {
    target: {
      type: Object
    },
    importComponent: {
      type: [Object, Function]
    },
    props: {
      type: Object
    },
    drawer: {
      type: Object
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    resetText: {
      type: String,
      default: '重置'
    },
    cancelText: {
      type: String,
      default: '取消'
    }
  },
  provide () {
    return {
      '$target': this.target
    }
  },
  watch: {
    importComponent () {
      this.loadComponent()
    }
  },
  data () {
    return {
      loading: true,
      visible: false,
      component: null
    }
  },
  mounted () {
    this.visible = true
  },
  methods: {
    loadComponent () {
      if (this.importComponent) {
        this.loading = true
        this.importComponent().then(res => {
          if (!res.default.mixins) {
            res.default.mixins = []
          }
          res.default.mixins.push({
            inject: ['$target'],
            props: ['query']
          })
          this.component = res.default
          this.loading = false
        })
      }
    },
    handleSubmit () {
      this.$refs['component'].handleSubmit && this.$refs['component'].handleSubmit()
    },
    handleReset () {
      this.$refs['component'].handleReset && this.$refs['component'].handleReset()
    },
    handleClose () {
      this.visible = false
    },
    handleClosed () {
      this.$emit('closed')
    },
    handleOpened () {
      this.loadComponent()
    },
    handleMouseDown (e) {
      let pageX = e.pageX
      let node = e.target.closest('.ms-drawer')
      let width = node.offsetWidth
      document.onmousemove = (e) => {
        e.preventDefault()
        node.style.width = width + (pageX - e.pageX) + 'px'
      }
      document.onmouseup = () => {
        document.onmousemove = document.onmouseup = null
      }
    },
    handleMounted () {
      let node = this.$el.querySelector('.el-drawer__container')
      if (node) {
        node.title = '双击可以快速关闭弹框'
        node.querySelector('.ms-drawer').title = ''
        node.ondblclick = e => {
          if (node === e.target) {
            this.handleClose()
          }
        }
      }
    }
  }
}
</script>
<style lang="scss">
  .ms-drawer{
    max-height: 100%;
    max-width: 100%;
    &--error,&--loading{
      margin:auto;
      font-size:1.2em;
      color:#ccc;
      text-align:center;
      i{
        font-size:3em;
      }
      .el-spinner-inner .path{
        stroke: $--color-primary;
      }
    }
    &--mini{
      min-width:14rem;
      width:14rem;
    }
    &--small{
      min-width:26rem;
      width:26rem;
    }
    &--default{
      min-width:43rem;
      width:43rem;
    }
    &--large{
      min-width:62rem;
      width:62rem;
    }
    &--layout{
      display:flex;
      flex-direction:column;
      height: 100%;
    }
    &--body{
      flex:auto;
      padding: 0 15px;
      position: relative;
      .e-page-list-layout{
        margin:0;
        border:0;
        &--table{
          padding:0;
        }
        .form-search{
          margin-left:0;
          margin-top:0;
        }
      }
    }
    &--footer{
      text-align:center;
      padding:15px 0;
      .el-button{
        min-width:100px;
      }
    }
    &--resize{
      position:absolute;
      top:0;
      width:10px;
      height:100%;
      left:0;
      cursor: e-resize;
      margin-left:-5px;
    }
    &--mask{
      pointer-events: none;
    }
    .el-drawer{
      &__container{
        overflow:hidden;
      }
      &__header{
        margin-bottom:15px;
        padding:15px;
        padding-bottom:0;
        >span{
          font-size:1.2rem;
        }
        button{
          outline:none;
          padding:0;
        }
      }
      &__body{
        max-height:calc(100% - 55px);
      }
    }
  }
</style>
