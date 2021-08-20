<template>
  <div id="app" v-if="$route && $route.path">
    <el-config-provider :locale="locale">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>

<script>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

export default {
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
  },
  data() {
    return {
      locale: zhCn
    }
  }
}
</script>
<style lang="scss">
  body{
    margin:0;
    font-size:14px;
  }
</style>
