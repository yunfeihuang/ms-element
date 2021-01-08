# Figure插文的图片
<div style="padding:10px;background:#f7f7f7;">
  <el-row :gutter="10">
    <el-col :span="4">
      <e-figure
        image="https://17476858.s21i.faiusr.com/2/ABUIABACGAAgwLGx5QUonqDBhgYwwB840Bc!600x600.jpg"
        figcaption="走访会员企业深圳市四方创展电子科技有限公司"
        secondary="4月8日下午，我会常务副秘书长胡">
      </e-figure>
    </el-col>
    <el-col :span="4">
      <e-figure
        :theme="['fadein']"
        image="https://17476858.s21i.faiusr.com/2/ABUIABACGAAgwLGx5QUonqDBhgYwwB840Bc!600x600.jpg"
        figcaption="走访会员企业深圳市四方创展电子科技有限公司"
        secondary="4月8日下午，我会常务副秘书长胡">
      </e-figure>
    </el-col>
    <el-col :span="4">
      <e-figure
        :theme="['full-fadein']"
        image="https://17476858.s21i.faiusr.com/2/ABUIABACGAAgwLGx5QUonqDBhgYwwB840Bc!600x600.jpg"
        figcaption="走访会员企业深圳市四方创展电子科技有限公司"
        secondary="4月8日下午，我会常务副秘书长胡">
      </e-figure>
    </el-col>
    <el-col :span="4">
      <e-figure
        :theme="['fadein-top']"
        image="https://17476858.s21i.faiusr.com/2/ABUIABACGAAgwLGx5QUonqDBhgYwwB840Bc!600x600.jpg"
        figcaption="走访会员企业深圳市四方创展电子科技有限公司"
        secondary="4月8日下午，我会常务副秘书长胡">
      </e-figure>
    </el-col>
    <el-col :span="4">
      <e-figure
        :theme="['full-fadein-top']"
        image="https://17476858.s21i.faiusr.com/2/ABUIABACGAAgwLGx5QUonqDBhgYwwB840Bc!600x600.jpg"
        figcaption="走访会员企业深圳市四方创展电子科技有限公司"
        secondary="4月8日下午，我会常务副秘书长胡">
      </e-figure>
    </el-col>
    <el-col :span="4">
      <e-figure :theme="['border','scale']" image="https://17476858.s21i.faiusr.com/4/ABUIABAEGAAg4tKM4QUowcylyQMwwAM4qgI!300x300.png"></e-figure>
    </el-col>
  </el-row>
</div>

```html
<template>
  <div style="padding:10px;background:#f7f7f7;">
  <el-row :gutter="10">
    <el-col :span="4">
      <e-figure
        image="https://17476858.s21i.faiusr.com/2/ABUIABACGAAgwLGx5QUonqDBhgYwwB840Bc!600x600.jpg"
        figcaption="走访会员企业深圳市四方创展电子科技有限公司"
        secondary="4月8日下午，我会常务副秘书长胡">
      </e-figure>
    </el-col>
    <el-col :span="4">
      <e-figure
        :theme="['fadein']"
        image="https://17476858.s21i.faiusr.com/2/ABUIABACGAAgwLGx5QUonqDBhgYwwB840Bc!600x600.jpg"
        figcaption="走访会员企业深圳市四方创展电子科技有限公司"
        secondary="4月8日下午，我会常务副秘书长胡">
      </e-figure>
    </el-col>
    <el-col :span="4">
      <e-figure
        :theme="['full-fadein']"
        image="https://17476858.s21i.faiusr.com/2/ABUIABACGAAgwLGx5QUonqDBhgYwwB840Bc!600x600.jpg"
        figcaption="走访会员企业深圳市四方创展电子科技有限公司"
        secondary="4月8日下午，我会常务副秘书长胡">
      </e-figure>
    </el-col>
    <el-col :span="4">
      <e-figure
        :theme="['fadein-top']"
        image="https://17476858.s21i.faiusr.com/2/ABUIABACGAAgwLGx5QUonqDBhgYwwB840Bc!600x600.jpg"
        figcaption="走访会员企业深圳市四方创展电子科技有限公司"
        secondary="4月8日下午，我会常务副秘书长胡">
      </e-figure>
    </el-col>
    <el-col :span="4">
      <e-figure
        :theme="['full-fadein-top']"
        image="https://17476858.s21i.faiusr.com/2/ABUIABACGAAgwLGx5QUonqDBhgYwwB840Bc!600x600.jpg"
        figcaption="走访会员企业深圳市四方创展电子科技有限公司"
        secondary="4月8日下午，我会常务副秘书长胡">
      </e-figure>
    </el-col>
    <el-col :span="4">
      <e-figure :theme="['border','scale']" image="https://17476858.s21i.faiusr.com/4/ABUIABAEGAAg4tKM4QUowcylyQMwwAM4qgI!300x300.png"></e-figure>
    </el-col>
  </el-row>
</div>
  </div>
</template>
```

### Props
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |------------- |--------- |
| image     |  图片路径  | String  |   -       |    -    |
| figcaption    |  主标题  | String  |   -       |    -    |
| secondary     |  副标题  | String  |   -       |    -    |
| theme     |  样式风格  | Array  |   -       |    -    |

### Events
| 事件名称 | 说明 | 回调参数 |
|---------|--------|---------|
| - | - | - |

### Slots
| 名称 | 说明 | 
|---------|--------|
| img | 图片 |
| default | - |