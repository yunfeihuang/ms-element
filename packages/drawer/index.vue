<template>
  <component
    :is="`el-${mode || 'drawer'}`"
    v-bind="drawer"
    :title="drawerTitle || drawer.title"
    :model-value="visible"
    @close="handleClose"
    @opened="handleOpened"
    @closed="handleClosed">
    <template v-if="titleSlot" #title>
      <component :is="titleSlot"></component>
    </template>
    <div ref="body" v-if="mode=='dialog'" class="ms-drawer--dialog-body" v-loading="loading">
      <iframe v-if="to" :src="to" frameborder="0" @load="handleLoading(false)"></iframe>
      <component
        v-else
        ref="component"
        :is="component"
        v-bind="componentProps || props"
        @loading="handleLoading"
        @posting="handlePosting"
        @close="handleClose"
      />
    </div>
    <template #footer v-if="mode=='dialog' && isFormComponent">
      <el-button
        nativeType="button"
        @click="handleClose">
        {{cancelText}}
      </el-button>
      <el-button
        type="primary"
        nativeType="button"
        @click="handleSubmit">
        {{confirmText}}
      </el-button>
    </template>
    <div ref="body" v-if="mode=='drawer'" class="ms-drawer--layout" v-loading="loading">
      <div class="ms-drawer--body ms-scroller">
        <component
          ref="component"
          :is="component"
          v-bind="componentProps || props"
          @loading="handleLoading"
          @posting="handlePosting"
          @close="handleClose"
        />
      </div>
      <div class="ms-drawer--footer" v-if="footerSlot">
        <component :is="footerSlot"></component>
      </div>
      <div class="ms-drawer--footer" v-else-if="isFormComponent">
        <el-button
          :form="formId"
          v-if="confirmText"
          type="primary"
          :nativeType="formId ? 'submit':'button'"
          @click.prevent="handleSubmit">
          {{confirmText}}
        </el-button>
        <el-button
          v-if="resetText"
          nativeType="button"
          @click="handleReset">
          {{resetText}}
        </el-button>
        <el-button
          v-if="cancelText"
          nativeType="button"
          @click="handleClose">
          {{cancelText}}
        </el-button>
      </div>
    </div>
    <div v-if="mode=='drawer'" class="ms-drawer--resize" @mousedown.prevent="handleMouseDown"/>
  </component>
</template>

<script>
export default {
  name: 'MsDrawer',
  props: {
    mode: {
      type: String,
      default: 'drawer'
    },
    target: {
      type: Object
    },
    importComponent: {
      type: [Object, Function]
    },
    to: {
      type: [Object, String]
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
      default: '清空'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    titleSlot: {},
    footerSlot: {}
  },
  provide () {
    return {
      msDrawer: this
    }
  },
  watch: {
    importComponent () {
      this.loadComponent()
    },
    component () {
      this.$nextTick(() => {
        this.handleMounted()
      })
    },
    $route (val, oldVal) {
      if (val.path !== oldVal.path) {
        this.visible = false
      }
    }
  },
  data () {
    return {
      loading: true,
      visible: false,
      isFormComponent: false,
      drawerTitle: '',
      componentProps: null,
      component: null,
      formId: ''
    }
  },
  mounted () {
    this.visible = true
    if (this.target && this.target.$popups) {
      this.target.$popups.push(this) // eslint-disable-line
    }
  },
  methods: {
    handleLoading (value) {
      if (value) {
        this.loadingDone = null
      }
      this.loading = value
    },
    handlePosting (value) {
      this.loading = value
    },
    loadComponent () {
      let mixin = {
        inject: ['msDrawer'],
        props: {
          params: {},
          done: {
            type: Function
          },
          promiseSubmit: {
            type: Function
          }
        }
      }
      let addMixins = component => {
        if (!component.props) {
          component.props = {}
        }
        Object.assign(component.props, mixin.props)
        if (component.inject && component.inject.indexOf('msDrawer') == -1) {
          component.inject.push('msDrawer')
        } else {
          component.inject = mixin.inject
        }
        return component
      }
      if (this.importComponent && this.importComponent instanceof Function) {
        let promise = this.importComponent()
        if (promise) {
          this.loading = true
          this.loadingDone = () => {
            this.loading = false
          }
        }
        promise.then(res => {
          this.component = addMixins(res.default)
        }).finally(() => {
          setTimeout(() => {
            this.loadingDone && this.loadingDone()
          }, 100)
        })
      } else {
        this.component = addMixins(this.importComponent)
        this.loading = false
      }
    },
    handleSubmit () {
      this.$refs['component'].handleSubmit && this.$refs['component'].handleSubmit()
    },
    handleReset () {
      this.$refs['component'].handleReset && this.$refs['component'].handleReset()
    },
    handleClose () {
      if (this.visible) {
        this.$emit('pop-close')
      }
      this.visible = false
    },
    handleClosed () {
      this.$emit('closed')
    },
    handleOpened () {
      this.loadComponent()
      this.$nextTick(() => {
        let node = this.$refs.body.closest('.el-overlay')
        if (node) {
          node.title = '双击可以快速关闭弹框'
          node.querySelector('.ms-drawer').title = ''
          node.ondblclick = e => {
            if (node === e.target) {
              this.handleClose()
            }
          }
        }
      })
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
      if (this.$refs.component && this.$refs.component.handleSubmit && this.$refs.component.form) {
        this.isFormComponent = true
        const node = this.$refs.body.querySelector('.ms-form-default')
        node && (this.formId = node.id)
      } else {
        this.isFormComponent = false
      }
    }
  }
}
</script>
