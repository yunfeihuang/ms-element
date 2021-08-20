import { inject, onMounted, ref, watch } from "vue";

export default function (props, {emit}, f) {
  const loading = ref(false)
  const response = ref({})
  const msDrawer = inject('msDrawer')
  const fetch = (option) => {
    if (f) {
      const promise = f(option)
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
  onMounted(() => {
    msDrawer && emit('mounted')
    fetch()
  })
  watch(loading.value, val => {
    msDrawer && emit('loading', val)
  })
  return {
    loading,
    response,
    fetch,
    refresh: fetch
  }
}
