# Img 图片
<e-img style="width:150px;height:150px;" src="/"></e-img><e-img style="width:60px;height:60px;"></e-img><e-img style="width:40px;height:40px;"></e-img>
## v-preview指令 赋值是定义分组
<e-img src="/static/images/img_qr.jpg" v-preview></e-img>
<e-img src="/static/images/img_qr.jpg" v-preview="'name1'"></e-img><e-img src="/static/images/img_qr.jpg" v-preview="'name1'"></e-img>

```html
<e-img style="width:150px;height:150px;" src="/"></e-img>
<e-img style="width:60px;height:60px;"></e-img>
<e-img style="width:40px;height:40px;"></e-img>
<e-img src="/static/images/img_qr.jpg" v-preview></e-img>
<e-img src="/static/images/img_qr.jpg" v-preview="'name1'"></e-img>
<e-img src="/static/images/img_qr.jpg" v-preview="'name1'"></e-img>

```

### Props
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |------------- |--------- |
| -     | -   | -  |   -       |    -    |

### Events
| 事件名称 | 说明 | 回调参数 |
|---------|--------|---------|
| - | - | - |

### Slots
| 名称 | 说明 | 
|---------|--------|
| - | - |