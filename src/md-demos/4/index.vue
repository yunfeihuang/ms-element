<template>
  <div>
    <list :data="list">
      <!-- 通过template模板配置slot-scope属性来获取循环当前项值 -->
      <template v-slot="scope">
        {{scope}}
      </template>
    </list>
  </div>
</template>

<script>
import List from './List'
export default {
  components: {
    List
  },
  data () {
    let list = []
    for (let i = 0; i < 10; i++) {
      list.push({
        id: Math.random()
      })
    }
    return {
      list
    }
  }
}
</script>
