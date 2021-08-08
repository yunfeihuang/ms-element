<template>
  <div>
    <textarea style="height:150px" class="el-textarea__inner" :value="jsonString" @change="handleChange($event)">
    </textarea>
    <el-button type="text" @click="handleClick">使用示例数据</el-button>
  </div>
</template>

<script>
export default {
  props: {
    value: {},
    example: {
      default () {
        return [{label: '选项1', value: '1'},{label: '选项2', value: '2'}]
      }
    }
  },
  data () {
    return {
      form: { // 必须使用form来绑定表单数据
        prop: '',
        label: '',
        component: 'el-input',
        slots: []
      }
    }
  },
  computed: {
    jsonString () {
      if (this.value) {
        return `${JSON.stringify(this.value, null, 2)}`
      } else {
        return ''
      }
    }
  },
  methods: {
    stringify (array) {
      if (array) {
        return `${JSON.stringify(array, null, 2)}`
      } else {
        return ''
      }
    },
    handleChange(e) {
      try {
        let json = JSON.parse(e.target.value)
        if (e.target.value.trim()) {
          if (json) {
            this.$emit('input', json)
          }
        } else {
          this.$emit('input', [])
        }
      } catch (e) {
        console.log(e)
      }
    },
    handleClick () {
      this.$emit('input', this.example)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
