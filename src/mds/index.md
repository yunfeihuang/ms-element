# 快速上手
### 安装
```
  cnpm install h666888 --save // 由于组件库还没有发布到npm上面忽略此步
```

### webpack.base.conf.js 配置别名
```
  alias: {
    'e-ui': path.resolve(__dirname, '../static/e-ui') // 需要把e-ui组件库放到static目录下
  }
```

### 引用组件库（管理后台项目）
```
  import Vue from 'vue'
  import 'e-ui/lib/style/theme/management.css'
  import * as EUI from 'e-ui/lib/management.js'
  Vue.use(EUI)
```
### 引用组件库（C端官网项目）
```
  import Vue from 'vue'
  import 'e-ui/lib/style/theme/index.css'
  import * as EUI from 'e-ui/lib/index.js'
  Vue.use(EUI)
```

### 使用局部组件
```
  import 'e-ui/lib/style/theme/signin.css'
  import ESignin from 'e-ui/lib/signin'
  export default {
    components: {
      ESignin
    }
  }
```