<template>
  <div>
   <v-node v-model="value1" /> {{value1}} <br/>
   <jsx v-model="value2"/> {{value2}}
  </div>
</template>

<script>
export default {
  components: {
    VNode: {
      props: {
        value: {
          type: String
        }
      },
      render (createElement) {
        return createElement('input', {
          attrs: {
            value: this.value
          },
          on: {
            input: this.handleInput
          }
        })
      },
      methods: {
        handleInput (e) {
          this.$emit('input', e.target.value)
        }
      }
    },
    Jsx: {
      props: {
        value: {
          type: String
        }
      },
      render (h) {
        return <input value={this.value} onInput={this.handleInput} />
      },
      methods: {
        handleInput (e) {
          this.$emit('input', e.target.value)
        }
      }
    }
  },
  data () {
    return {
      value1: 'vnode render',
      value2: 'jsx render'
    }
  }
}
</script>
