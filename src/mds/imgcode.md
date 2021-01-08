# 图片验证码

### 注意：需要在webpack.base.conf.js
<e-flexbox>
  <e-flexbox-item style="margin-right:10px">
    <e-img-code ref="imgCode" inline v-model="value" :img-key.sync="imgKey"></e-img-code>
  </e-flexbox-item>
  <el-button @click="$refs.imgCode.refresh()">换一张图片</el-button>
</e-flexbox>
imgKey：{{imgKey}}

```html
<template>
  <div>
    <flexbox>
      <flexbox-item style="margin-right:10px">
        <e-img-code ref="imgCode" inline v-model="value" :img-key.sync="imgKey"></e-img-code>
      </flexbox-item>
      <el-button @click="$refs.imgCode.refresh()">换一张图片</el-button>
    </flexbox>
    imgKey：{{imgKey}}
  </div>
</template>
<script>
  export default {
    data () {
      return {
        value: '',
        imgKey: ''
      }
    }
  }
</script>
```

### Extends
[Element Input](http://element.eleme.io/#/zh-CN/component/input)

### Props
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |------------- |--------- |
| action     |  请求图片接口地址  | string  |   -       |    -    |
| params     |  请求图片接口参数  | object  |   -       |    -    |
| imgKey[sync]     | 接口响应回来的key   | string  |   -       |    -    |

### Events
| 事件名称 | 说明 | 回调参数 |
|---------|--------|---------|
| - | - | - |

### Slots
| 名称 | 说明 | 
|---------|--------|
| - | - |