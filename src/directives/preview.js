import Vue from 'vue'
export default {
  // 当绑定元素插入到 DOM 中。
  inserted (el, binding, vnode, oldVnode) {
    let groupName = binding.value
    if (groupName) {
      el.setAttribute('data-preview', groupName)
      el.dataset.preview = groupName
    }
    el.addEventListener('click', e => {
      let initialIndex = 0
      let url = e.target.src
      if (e.target.dataset) {
        if (e.target.dataset.src) {
          url = e.target.dataset.src
        }
        if (e.target.dataset.preview) {
          let nodes = document.querySelectorAll(`img[data-preview=${e.target.dataset.preview}]`)
          url = Array.from(nodes).map((item, index) => {
            if (item === e.target) {
              initialIndex = index
            }
            return item.dataset && item.dataset.src ? item.dataset.src : item.src
          })
        }
        // terry add
        // if (e.target.dataset.previewurllist) {
        //   url = JSON.parse(e.target.dataset.previewurllist)
        // }
      }
      console.log(initialIndex)
      let el = document.createElement('div')
      document.body.appendChild(el)
      let vm = new Vue({
        el,
        template: `
          <e-preview
            :initial-index="initialIndex"
            :src="url"
            :visible.sync="visible"
            @closed="handleClose"/>
        `,
        data () {
          return {
            url,
            initialIndex,
            visible: false
          }
        },
        mounted () {
          this.visible = true
        },
        destroyed () {
          document.body.removeChild(this.$el)
        },
        methods: {
          handleClose () {
            vm.$destroy()
          }
        }
      })
    }, false)
  }
}
