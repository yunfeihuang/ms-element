
export default [
  {
    path: '/',
    component: () => import('../index.vue'),
    meta: {
      title: '设计首页'
    }
  },
  {
    path: '/page/preview',
    component: () => import('../preview/index.vue'),
    meta: {
      title: '预览'
    }
  },
  {
    path: '/page/:id/:title',
    component: () => import('../index.vue'),
    meta: {
      title: '页面'
    }
  }
]
