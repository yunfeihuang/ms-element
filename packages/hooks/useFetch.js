import { onMounted, ref, watch, getCurrentInstance } from "vue";

export default function (props, {emit}) {
  const loading = ref(false)
  const response = ref(null)
  const beforeFetch = function (option) {
    if (this.fetch) {
      const promise = this.fetch(option)
      if (promise && promise.then) {
        loading.value = true
        return promise.then(res => {
          response.value = res
          return res
        }).finally(() => {
          loading.value = false
        })
      } else {
        return Promise.resolve()  
      }
    } else {
      return Promise.resolve()
    }
  }
  const refresh = function (option) {
    if (this.beforeFetch) {
      return this.beforeFetch(option).then(res => {
        this.fetchDone && this.fetchDone(res)
        return res
      })
    }
  }
  onMounted(() => {
    let { proxy } = getCurrentInstance()
    proxy && proxy.refresh()
  })
  watch(loading, val => {
    emit('loading', val)
  })
  return {
    loading,
    response,
    beforeFetch,
    refresh
  }
}
