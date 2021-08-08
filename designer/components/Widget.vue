<template>
  <div class="ms-designer-widget">
    <div class="ms-designer-widget-action">
      <el-button size="mini" icon="el-icon-plus" circle></el-button>
      <el-button size="mini" icon="el-icon-edit" circle></el-button>
      <el-button size="mini" icon="el-icon-delete" circle></el-button>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style lang="scss">
  .ms-designer-widget{
    position: relative;
    &-action{
      position: absolute;
    }
  }
</style>
