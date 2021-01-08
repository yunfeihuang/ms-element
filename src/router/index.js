export default [
  {
    path: '/',
    component: () => import('@/demos/console')
  },
  {
    path: '/example',
    component: () => import('@/demos/example')
  },
  {
    path: '/example/detail',
    component: () => import('@/demos/example/detail')
  }
]
