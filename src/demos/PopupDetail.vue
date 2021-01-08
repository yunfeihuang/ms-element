<template>
  <div>
    详情内容...
  </div>
</template>

<script>
export default {
  data () {
    return {
      detail: {}
    }
  },
  methods: {
    fetch () { // 必须要返回axios promise
      /*
      if (this.query) {
        return this.$axios({
          url: `/v1/detail/${query}`
        }).then(res => {
          this.detail = res.data
        })
      }
      */
    }
  }
}
</script>
