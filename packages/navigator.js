import Drawer from '../packages/drawer'
import {h} from 'vue'

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
    if (!context.$popups) {
      context.$popups = []
    }
    let el = document.createElement('div')
    document.body.appendChild(el)

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
      to = `${context.$router.mode === 'history' ? '' : window.location.pathname}${context.$router.resolve(importComponent).href}`
      classnames.push('is-frame')
    }
    const vm = window.$createApp({ // eslint-disable-line
      parent: context,
      router: context.$router,
      store: context.$store,
      render: () => h(Drawer, {
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
        footerSlot,
        onClose () {
          if (context.$popups.length) {
            let vm = context.$popups.pop()
            vm.$destroy && vm.$destroy()
          }
        },
        ref: 'drawer'
      }),
      destroyed () {
        this.$el.parentNode && this.$el.parentNode.removeChild(this.$el)
      }
    })
    context.$popups.push(vm.mount(el))
  },
  replace (context, importComponent, {
    title,
    promiseSubmit,
    done,
    params
  }) {
    if (context.$popups.length) {
      let vm = context.$popups[context.$popups.length - 1]
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
    if (context.$popups.length) {
      context.$popups[context.$popups.length - 1].$refs.drawer.handleClose()
    }
  }
}
