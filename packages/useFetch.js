import { inject, onMounted, ref, watch, getCurrentInstance } from "vue";

export default function (props, {emit}) {
  let { proxy } = getCurrentInstance()
  const loading = ref(false)
  const response = ref(null)
  const msDrawer = inject('msDrawer')
  const beforeFetch = (option) => {
    if (proxy.fetch) {
      const promise = proxy.fetch(option)
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
  const refresh = (option) => {
    if (proxy.beforeFetch) {
      return proxy.beforeFetch(option).then(res => {
        proxy.fetchDone && proxy.fetchDone(res)
        return res
      })
    }
  }
  onMounted(() => {
    msDrawer && emit('mounted')
    proxy.refresh()
  })
  watch(loading.value, val => {
    msDrawer && emit('loading', val)
  })
  return {
    loading,
    response,
    beforeFetch,
    refresh,
    parseResponse
  }
}
