<template functional>
  <el-dialog
    fullscreen
    custom-class="e-preview"
    :class="[data.staticClass, data.class]"
    :style="data.staticStyle && data.style ? [data.staticStyle,data.style] : data.staticStyle || data.style"
    v-bind="data.attrs"
    v-on="listeners">
    {{data.attrs}}
    <template v-if="props.src">
      <el-carousel :initial-index="props.initialIndex" style="width: 100vw;" height="100vh" v-if="props.src.forEach" :autoplay="false">
        <el-carousel-item v-for="(item,index) in props.src" :key="index">
          <img :src="item"/>
        </el-carousel-item>
      </el-carousel>
      <img v-else :src="props.src"/>
    </template>
  </el-dialog>
</template>

<script>
export default {
  componentName: 'EPreview'
}
</script>
