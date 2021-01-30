<template>
  <div style="padding:18px;margin:10px;background:#fff;">
    <Detail :params="$route.query"/>
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
