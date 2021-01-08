<template>
  <div>
    <h2>value：{{value}}</h2>
    <child1 v-model="value" />
    <child2 :value.sync="value"/>
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
  }
}
</script>
