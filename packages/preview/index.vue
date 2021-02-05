<template functional>
  <el-dialog
    title="双击关闭图片浏览"
    fullscreen
    custom-class="ms-preview"
    :class="[data.staticClass, data.class]"
    :style="data.staticStyle && data.style ? [data.staticStyle,data.style] : data.staticStyle || data.style"
    v-bind="data.attrs"
    v-on="listeners"
    @dblclick.native="$options.methods.handleClose(listeners)">
    <template v-if="props.src">
      <template v-if="props.src.forEach">
        <el-carousel :initial-index="props.initialIndex" style="width: 100vw;" height="100vh" v-if="props.src.length > 1" :autoplay="false">
          <el-carousel-item v-for="(item,index) in props.src" :key="index">
            <img :src="item"/>
          </el-carousel-item>
        </el-carousel>
        <img v-else :src="props.src[0]"/>
      </template>
      <img v-else :src="props.src"/>
    </template>
  </el-dialog>
</template>

<script>
export default {
  componentName: 'MsPreview',
  methods: {
    handleClose (listeners) {
      listeners.close && listeners.close()
    }
  }
}
</script>
