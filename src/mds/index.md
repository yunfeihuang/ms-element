# 安装和快速上手

### 安装
```
  npm install ms-element --save-dev
```

### 全局注册组件
```
  import {createApp} from 'vue'
  import App from './App'
  import 'ms-element/lib/style/theme/index.css'
  import MsElement from 'ms-element'
  createApp(App).use(MsElement)
```


### 修改UI主题风格

```
  #修改packages/style/src/variable.scss变量后运行以下命令即可
  npm run build:theme
```


## 使用MS Designer开发管理后台

### 1.安装MS Designer
```
npm install ms-designer --save-dev
```

###  2.配置项目vue.config.js
```
// 引入devServer
const MSDevServer = require('ms-designer/devServer')

// 配置 devServer
devServer: {
  proxy: {
    '/designer/': {
      target: 'http://mselement.bittyos.com/'
    },
    '/designer-api/': {
      target: 'http://mselement.bittyos.com/',
      changeOrigin: true
    }
  },
  before (app) {
    MSDevServer(app, path.join(__filename, '../'))
  }
}
```
###  3.访问当前项目启动后地址，如：http://localhost:8080/designer/

###  4.登录进去可以创建自己的项目并设计列表页面