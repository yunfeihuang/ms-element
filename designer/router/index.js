
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
    path: '/',
    component: () => import('../index.vue'),
    meta: {
      title: '设计首页',
      keepAlive: true
    }
  },
  {
    path: '/view/:id',
    component: () => import('../preview/index.vue'),
    meta: {
      title: '页面'
    }
  },
  {
    path: '/preview',
    component: () => import('../preview/index.vue'),
    meta: {
      title: '预览'
    }
  },
  {
    path: '/:id',
    component: () => import('../index.vue'),
    meta: {
      title: '页面'
    }
  }
]
