<template>
  <div class="layout">
    <!-- $slots对象，里面有外部传入vnode数组 -->
    <slot v-if="$slots.header" name="header"></slot>
    <my-header v-else></my-header>
    <!-- slot[name]="header"定义slot -->
    <slot name="body"></slot>
    <slot v-if="$slots.footer" name="footer"></slot>
    <div v-else>footer内容区</div>
    <!-- 没有name属性默认是default值 -->
    <slot></slot>
  </div>
</template>

<script>
import MyHeader from './MyHeader'
export default {
  components: {
    MyHeader
  },
  mounted () {
    console.log('$slots：', this.$slots)
  }
}
</script>

<style lang="scss" scoped>
  .layout {
    div{
      border: 1px solid #999;
      line-height:60px;
      margin: 15px 0;
      padding-left:20px;
    }
  }
</style>
