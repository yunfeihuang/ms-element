<template>
  <div>
    <div style="padding:10px;">
      <router-link :to="{path: '/message/detail'}" replace>go to message detail</router-link>
    </div>
  </div>
</template>

<script>
export default {
  mixins: [ms.mixins.fetch]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
