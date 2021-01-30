export default {
  // 当绑定元素插入到 DOM 中。
  inserted (el) {
    // 聚焦元素
    if (/^(input||textarea)$/i.test(el.nodeName)) {
      el.focus()
    } else {
      let node = el.querySelector('input,textarea')
      node && node.focus()
    }
  }
}
