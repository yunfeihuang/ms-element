export default {
  // 当绑定元素插入到 DOM 中。
  inserted (el, binding, vnode, oldVnode) {
    if (process.env.NODE_ENV !== 'production') {
      el.classList.add('is-dev')
    }
  }
}
