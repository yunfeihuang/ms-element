# components

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
###### 文档地址
http://ui.milewsys.com

# 右边弹窗修改

## 1.将原来的打开弹框方式popupOpen = 'create' 修改成 pushOpen('create') 如果需要传参数 pushOpen('create', query)
## 2.编辑表单“<update-form-popup :query="popupQuery"></update-form-popup>”修改成“<update-form-popup></update-form-popup>”去掉query属性,如果要传参数 pushOpen('update', query) //query是传递给表单的

# 导出修改
## 1.data函数内将 multipleSelection=[] 修改成 multipleSelectionProp='id' // id指设置返回的数据列表唯一标识属性名
## 2.在导出事件函数this. multipleSelection 修改成 multipleSelectionAll
## 3.导出按钮的:disabled="multipleSelection.length==0" 修改成:  disabled="multipleSelectionAll.length==0"

# 2019.6.5 terry
## e-dialog-iframe 添加样式绑定
## :style="data.staticStyle && data.style ? [data.staticStyle,data.style] : data.staticStyle || data.style"



