import Drawer from '../packages/drawer'

let set = new Set()
export default {
  push (context, importComponent, {
    mode,
    title,
    direction = 'rtl',
    size = 'default',
    customClass,
    destroyOnClose = true,
    modal,
    closeOnPressEscape,
    beforeClose,
    appendToBody = true,
    modalAppendToBody = true,
    wrapperClosable = false,
    withHeader,
    showClose,
    confirmText,
    resetText,
    cancelText,
    promiseSubmit,
    done,
    params,
    titleSlot,
    footerSlot
  }) {
    let el = document.createElement('div')
    context.$el.appendChild(el)
    if (context.$el.closest && context.$el.closest('.el-dialog')) {
      if (modal === undefined) {
        modal = false
      }
      appendToBody = false
    }
    let classnames = ['ms-drawer']
    if (['ltr', 'rtl'].indexOf(direction) > -1 && size) {
      if (['mini', 'small', 'default', 'large'].indexOf(size) > -1) {
        classnames.push(`ms-drawer--${size}`)
      }
    }
    customClass && classnames.push(customClass)
    if (!done) {
      if (context.query && context.pageData && context.getTableProps) {
        done = () => {
          this.pop(context)
          context.beforeFetch && context.beforeFetch()
        }
      }
    }
    let to = null
    if (typeof importComponent === 'string' || (typeof importComponent === 'object' && importComponent.path)) {
      // console.log('dsafdsa', context.$router.getMatchedComponents(importComponent))
      to = `${context.$router.mode === 'history' ? '' : window.location.pathname}${context.$router.resolve(importComponent).href}`
      classnames.push('is-frame')
    }
    const vue = new window.Vue({ // eslint-disable-line
      el,
      parent: context,
      router: context.$router,
      store: context.$store,
      render: h => h(Drawer, {
        props: {
          target: context,
          importComponent,
          to,
          mode,
          drawer: {
            title,
            direction,
            size,
            destroyOnClose,
            customClass: classnames.join(' '),
            modal,
            closeOnPressEscape,
            beforeClose,
            appendToBody,
            modalAppendToBody,
            wrapperClosable,
            withHeader,
            showClose,
            top: '10vh',
            closeOnClickModal: false
          },
          props: {
            params,
            promiseSubmit,
            done
          },
          confirmText,
          resetText,
          cancelText,
          titleSlot,
          footerSlot
        },
        on: {
          closed: function () {
            let array = set[context]
            if (array.length) {
              let vm = array.pop()
              vm.$destroy && vm.$destroy()
            }
          }
        },
        ref: 'drawer'
      }),
      destroyed () {
        this.$el.parentNode && this.$el.parentNode.removeChild(this.$el)
      }
    })
    let array = set[context] || []
    array.push(vue)
    set[context] = array
  },
  replace (context, importComponent, {
    title,
    promiseSubmit,
    done,
    params
  }) {
    let array = set[context]
    if (array.length) {
      let vm = array[array.length - 1]
      vm.$refs.drawer.drawerTitle = title
      vm.$refs.drawer.componentProps = {
        promiseSubmit,
        done,
        params
      }
      vm.$refs.drawer.importComponent = importComponent
    }
  },
  pop (context) {
    let array = set[context]
    if (array.length) {
      array[array.length - 1].$refs.drawer.handleClose()
    }
  },
  preview (props = {}) {
    let node = document.createElement('div')
    document.body.appendChild(node)
    let _props = {
      appendToBody: true,
      modalAppendToBody: true,
      destroyOnClose: true,
      ...props
    }
    new Vue({ // eslint-disable-line
      el: node,
      data () {
        return {
          visible: _props.visible || true
        }
      },
      render (createElement) {
        return (
          <ms-preview
            visible={this.visible}
            {...{ attrs: _props }}
            onClose={this.handleClose}>
          </ms-preview>
        )
      },
      methods: {
        handleClose () {
          this.visible = false
        }
      }
    })
  }
}
