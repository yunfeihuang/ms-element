import Drawer from '@/Drawer'

let set = new Set()
class Navigator {
  static push (context, importComponent, {
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
    query
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
            query
          },
          confirmText,
          resetText,
          cancelText
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
  }
  static replace (context, importComponent, drawer, props) {
    let array = set[context]
    if (array.length) {
      let vm = array[array.length - 1]
      vm.$refs.drawer.importComponent = importComponent
    }
  }
  static pop (context) {
    let array = set[context]
    if (array.length) {
      array[array.length - 1].$emit('pop')
    }
  }
}

export default Navigator
