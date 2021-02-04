<template>
  <div>
    <Detail :params="$route.query" style="padding:10px;"/>
  </div>
</template>

<script>
import Detail from './components/Detail'
export default {
  mixins: [ms.mixins.fetch],
  components: {
    Detail
  },
  mounted () {
    this.$root.title = '用户详情2'
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
