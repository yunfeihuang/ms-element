const Layout = {
  template: `<router-view/>`
}
console.log(Layout)

let routes = []

const requireComponent = require.context('../views', true, /\.vue$/) // 找到components文件夹下以.vue命名的文件
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  const component = componentConfig.default || componentConfig
  if (component.route) {
    routes.push({
      ...component.route,
      component
      // component: () => import(component.__file.replace('src/', '@/'))
    })
  }
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
  {
    path: '/user',
    component: () => import('@/views/user/index.vue'),
    meta: {
      title: '用户管理',
      keepAlive: true
    }
  },
  ...routes
]
