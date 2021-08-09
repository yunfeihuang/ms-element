let routes = []

const requireComponent = require.context('../../src/views', true, /route.js$/) // 找到components文件夹下以.vue命名的文件
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  routes.push(componentConfig.default)
})

export default [
  {
    path: '/',
    component: () => import('../index.vue'),
    meta: {
      title: '设计首页',
      keepAlive: true
    }
  },
  {
    path: '/preview',
    component: () => import('../preview/index.vue'),
    meta: {
      title: '预览'
    }
  },
  ...routes
]
