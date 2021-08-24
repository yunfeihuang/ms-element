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
