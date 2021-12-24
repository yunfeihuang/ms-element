import {render, h } from 'vue'

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
    let self = this
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
      if (context.query && context.getTableProps) {
        done = () => {
          self.pop(context)
          context.beforeFetch && context.beforeFetch(context.query)
        }
      }
    }
    let to = null
    if (typeof importComponent === 'string' || (typeof importComponent === 'object' && importComponent.path)) {
      to = `${context.$router.mode === 'history' ? '' : window.location.pathname}${context.$router.resolve(importComponent).href}`
      classnames.push('is-frame')
    }
    const vm = h(context.$root.$.appContext.components['MsDrawer'], {
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
      onPopClose () {
        if (context.$popups.length) {
          let vm = context.$popups.pop()
          vm.$destroy && vm.$destroy()
        }
      }
    })
    vm.appContext = context.$root.$.appContext.app._context
    render(vm, el)
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
      const vm = context.$popups[context.$popups.length - 1]
      vm.handleClose && vm.handleClose()
    }
  }
}
