# 后台管理系统页面开发过程
### step1: 创建页面组件
在src/views下创建将要开发的模块文件夹xxx后创建index.vue文件（此文件参考example/index.vue或者其他模块的）

### step2: 配置页面路由
在src/router下创建将要开发的模块xxx.js文件,相关代码如下
```
#src/router/xxx.js
export default [
  {
    path: '/xxx',
    component: () => import('@/views/xxx/index.vue') // 配置上一步新建的index.vue文件
  }
]
#src/router/index.js
import xxx from './xxx' // 引入xxx模块的路由配置
export default new Router({
  routes: [
    {
      path: '/',
      component: () => import('@/views/index.vue'), // @指向根目录下的src文件夹
      children: [
        ...xxx // 应用到src/views/index.vue的router-view视图
      ]
    }
  ]
})
```

### step3: 在浏览器访问/xxx，然后就可以看到src/views/xxx/index.vue文件的内容
### 其他相关开发请参考如下
[列表页面开发-PageListLayout结构布局](#/pagelistlayout)
[列表页面开发-pageList分页列表](#/pagelist)
[表单开发-form表单提交](#/form)
[弹框层表单开发-popup弹框层](#/popup)

