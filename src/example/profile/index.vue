<template>
  <div>
    <div style="padding:10px;">
      <el-tabs v-model="active" type="card" @tab-click="handleTab">
        <el-tab-pane label="资料" name="0"></el-tab-pane>
        <el-tab-pane label="关注" name="1"></el-tab-pane>
        <el-tab-pane label="其他" name="2"></el-tab-pane>
      </el-tabs>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
const routers = ['/profile', '/profile/follow', '/profile/others']
export default {
  mixins: [ms.mixins.fetch],
  data () {
    return {
      active: routers.findIndex(item => item === this.$route.path) + ''
    }
  },
  methods: {
    handleTab () {
      this.$router.push({
        path: routers[Number(this.active)]
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
