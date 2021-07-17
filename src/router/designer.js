const Layout = {
  template: `<router-view/>`
}
console.log(Layout)
export default [
  {
    path: '/',
    component: () => import('@/designer/index.vue'),
    meta: {
      title: '设计首页'
    }
  }
]
