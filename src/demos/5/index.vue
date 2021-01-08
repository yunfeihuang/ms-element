<template>
  <div>
    value: {{value}} <br/>
    mounted console打印结果请看控制台
  </div>
</template>

<script>
export default {
  mixins: [
    {
      props: {
        value: {
          type: String,
          default: 'mixins value'
        }
      },
      mounted () {
        console.log('mixins mounted')
      }
    }
  ],
  props: {
    value: {
      type: String,
      default: 'this value'
    }
  },
  mounted () {
    console.log('this mounted')
  }
}
</script>
