# Swiper轮播 v4.4+版本的

<e-swiper :options="{effect: 'fade', speed: 2000}" :active.sync="active" style="height:100px;">
  <e-swiper-item v-for="item in 3"
    :key="item"
    :style="`background:rgb(${item===1 ? 255 : 100},${item===2 ? 255 : 100},${item===3 ? 255 : 100})`">
    {{item}}
  </e-swiper-item>
</e-swiper>

```html
<template>
  <e-swiper :options="{effect: 'fade',speed: 2000}" :active.sync="active" style="height:100px;">
    <e-swiper-item v-for="item in 3"
      :key="item"
      :style="`background:rgb(${item===1 ? 255 : 100},${item===2 ? 255 : 100},${item===3 ? 255 : 100})`">
      {{item}}
    </e-swiper-item>
  </e-swiper>
</template>
<script>
  export default {
    data () {
      return {
        active: 0
      }
    }
  }
</script>
```

### Extends
[Swiper4](https://www.swiper.com.cn/api/index.html)

### Props
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |------------- |--------- |
| active     | -   | Number  |   -       |    0    |
| autoplay     | -   | Boolean, Object  |   -       |    {disableOnInteraction: false}    |
| pagination     | -   | Boolean, Object  |   -       |    true    |
| navigation     | -   | Boolean, Object  |   -       |    false    |
| scrollbar     | -   | Boolean  |   -       |    false    |
| options     | 其他选择配置   | Object  |   -       |    -    |


### Events
| 事件名称 | 说明 | 回调参数 |
|---------|--------|---------|
| change | - | - |

### Slots
| 名称 | 说明 | 
|---------|--------|
| default | - |
