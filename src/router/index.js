/*
const Layout = {
  template: `<router-view/>`
}
*/

export default [
  {
    path: '/',
    component: () => import('@/example/console'),
    meta: {
      title: '控制台'
    }
  },
  {
    path: '/profile',
    component: () => import('@/example/profile'),
    meta: {
      title: '个人中心'
    }
  },
  {
    path: '/message',
    component: () => import('@/example/message'),
    meta: {
      title: '消息'
    }
  },
  {
    path: '/user',
    component: () => import('@/example/user'),
    meta: {
      title: '示例列表'
    }
  },
  {
    path: '/user/detail',
    component: () => import('@/example/user/detail'),
    meta: {
      title: '示例详情'
    }
  }
]
