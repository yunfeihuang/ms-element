<template>
  <div style="padding:10px;">
    <Detail :params="$route.query" style="background:#fff;padding: 20px;"/>
  </div>
</template>

<script>
import Detail from './components/Detail'
export default {
  mixins: [ms.mixins.fetch],
  components: {
    Detail
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
