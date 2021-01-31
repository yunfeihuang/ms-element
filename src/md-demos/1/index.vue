<template>
  <div>
   <child1 :value="value" />
   <child2 :value="value" @change="handleChange"/>
  </div>
</template>

<script>
import Child1 from './Child1'
import Child2 from './Child2'
export default {
  components: {
    Child1,
    Child2
  },
  data () {
    return {
      value: ''
    }
  },
  methods: {
    handleChange (e) { // 注册事件修改value 值
      this.value = e.target.value
    }
  }
}
</script>
