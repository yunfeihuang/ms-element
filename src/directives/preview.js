export default {
  // 当绑定元素插入到 DOM 中。
  inserted (el, binding, vnode, oldVnode) {
    let value = binding.value
    el.addEventListener('click', e => {
      if (window.$ms) {
        let url = e.target.src
        if (e.target.dataset) {
          if (e.target.dataset.src) {
            url = e.target.dataset.src
          }
        }
        window.$ms.navigator.preview({
          src: value || url
        })
      }
    }, false)
  }
}
