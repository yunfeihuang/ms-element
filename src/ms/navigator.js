import Drawer from '@/ms/components/drawer'

let set = new Set()
export default {
  push (context, importComponent, {
    title,
    direction = 'rtl',
    size = 'default',
    customClass,
    destroyOnClose = true,
    modal,
    closeOnPressEscape,
    beforeClose,
    appendToBody,
    wrapperClosable = false,
    withHeader,
    showClose,
    confirmText,
    resetText,
    cancelText,
    promiseSubmit,
    done,
    params,
    header,
    footer
  }) {
    let el = document.createElement('div')
    context.$el.appendChild(el)
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

    const vue = new window.Vue({ // eslint-disable-line
      el,
      render: h => h(Drawer, {
        props: {
          target: context,
          importComponent,
          drawer: {
            title,
            direction,
            destroyOnClose,
            customClass: classnames.join(' '),
            modal,
            closeOnPressEscape,
            beforeClose,
            appendToBody,
            wrapperClosable,
            withHeader,
            showClose
          },
          props: {
            params,
            promiseSubmit,
            done
          },
          confirmText,
          resetText,
          cancelText,
          slots: {
            header,
            footer
          }
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
        this.$el.parentNode.removeChild(this.$el)
      }
    })
    let array = set[context] || []
    array.push(vue)
    set[context] = array
  },
  replace (context, importComponent, drawer, props) {
    let array = set[context]
    if (array.length) {
      let vm = array[array.length - 1]
      vm.$refs.drawer.importComponent = importComponent
    }
  },
  pop (context) {
    let array = set[context]
    if (array.length) {
      array[array.length - 1].$refs.drawer.handleClose()
    }
  }
}
