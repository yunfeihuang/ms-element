export default [
  {
    path: '/',
    component: () => import('@/demos/console'),
    meta: {
      title: '控制台'
    }
  },
  {
    path: '/example',
    component: () => import('@/demos/example'),
    meta: {
      group: 'example',
      title: '示例列表'
    }
  },
  {
    path: '/example/detail',
    component: () => import('@/demos/example/detail'),
    meta: {
      group: 'example',
      title: '示例详情'
    }
  }
]
