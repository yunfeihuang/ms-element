export default {
  data () {
    return {
      popupOpen: [], // 当前打开的右侧弹框
      popups: [], // 存储加载的右侧弹框
      popupsQuery: {} // 用于传递右侧弹框表单参数对象集合（编辑表单）
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.popupOpen) {
      this.popupOpen = []
      this.$nextTick(next)
    } else {
      next()
    }
  },
  beforeRouteUpdate (to, from, next) {
    if (this.popupOpen) {
      this.popupOpen = []
      this.$nextTick(next)
    } else {
      next()
    }
  },
  methods: {
    handleClosePopup () {
      this.popupOpen = []
    },
    pushOpen (name, query) {
      this.popups.indexOf(name) === -1 && this.popups.push(name)
      this.$nextTick(() => {
        this.popupOpen.indexOf(name) === -1 && this.popupOpen.push(name)
        if (query !== undefined) {
          this.popupsQuery[name] = query
        }
      })
    },
    pushReloadOpen (name, query) {
      this.pushOpen(name, query)
    },
    popClose (name) {
      if (name) {
        if (this.popupOpen instanceof Array && this.popupOpen.length > 0) {
          this.popupOpen = this.popupOpen.filter(item => {
            return item !== name
          })
        } else {
          this.popupOpen = []
        }
      } else {
        if (this.popupOpen instanceof Array && this.popupOpen.length > 0) {
          this.popupOpen.pop()
          let currentPopupName = this.popupOpen[this.popupOpen.length - 1]
          let $vue = this.$refs['import-component-' + currentPopupName]
          $vue && $vue.handleBackIn && $vue.handleBackIn()
        } else {
          this.popupOpen = []
        }
      }
    }
  }
}
