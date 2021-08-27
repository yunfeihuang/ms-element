# MS Element
基于Vue3.x后台管理系统设计解决方案

## 示例浏览地址
http://mselement.bittyos.com

## 安装
```
npm install ms-element --save-dev
```
### 全局注册组件
```
import {createApp} from 'vue'
import App from './App'
import 'ms-element/lib/style/theme/index.css'
import MSElement from 'ms-element'
createApp(App).use(MSElement)
```

### 单个注册组件(FrameLayout示例)
```
import Vue from 'vue'
import App from './App'
import 'ms-element/lib/style/theme/frame-layout.css'
import { FrameLayout } from 'ms-element' // or import FrameLayout from 'ms-element/lib/frame-layout'
createApp(App).component(FrameLayout.name, FrameLayout)
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
###  3.访问当然项目启动后地址，如http://localhost:8080/designer/