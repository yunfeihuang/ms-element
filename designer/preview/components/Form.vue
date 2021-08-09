<template>
  <!--v-bind="getFormProps()" @submit.native.prevent="handleSubmit"是必须的-->
  <el-form v-bind="getFormProps()" @submit.native.prevent="handleSubmit">
    <el-form-item
        v-for="(item,index) in option"
        :key="index"
        :label="item.label"
        :prop="item.prop"
        :rules="item.rules">
        <component :is="item.component" v-bind="item.props" readonly controls-position="right" v-model="form[item.prop]">
          <template v-if="item.component === 'el-select'">
            <el-option v-for="(item,index) in item.slots" :key="index" v-bind="item"></el-option>
          </template>
          <template v-else-if="item.component === 'el-checkbox-group'">
            <el-checkbox v-for="(item,index) in item.slots" :key="index" v-bind="item"></el-checkbox>
          </template>
          <template v-else-if="item.component === 'el-radio-group'">
            <el-radio v-for="(item,index) in item.slots" :key="index" v-bind="item"></el-radio>
          </template>
          <template v-else-if="item.component === 'el-upload'">
            <el-button>上传</el-button>
          </template>
        </component>
      </el-form-item>
  </el-form>
</template>
<script>
export default {
  mixins: [
    ms.mixins.form
  ],
  data () {
    let form = this.params.row || {}
    let option = this.params.option.map(item => {
      if (!form[item.prop]) {
        form[item.prop] = null
      }
      return item
    })
    return {
      option,
      form
    }
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
