const Layout = {
  template: `<router-view/>`
}
console.log(Layout)

let routes = []

const requireComponent = require.context('../views', true, /route.js$/) // 找到components文件夹下以.vue命名的文件
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  routes.push(componentConfig.default)
})

console.log('routes', routes)
export default [
  {
    path: '/',
    component: () => import('@/designer/index.vue'),
    meta: {
      title: '设计首页',
      keepAlive: true
    }
  },
  ...routes
]
