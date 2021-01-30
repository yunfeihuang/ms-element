/*
const Layout = {
  template: `<router-view/>`
}
*/

export default [
  {
    path: '/',
    component: () => import('@/ms/console'),
    meta: {
      title: '控制台'
    }
  },
  {
    path: '/profile',
    component: () => import('@/ms/profile'),
    meta: {
      title: '个人中心'
    }
  },
  {
    path: '/message',
    component: () => import('@/ms/message'),
    meta: {
      title: '消息'
    }
  },
  {
    path: '/example',
    component: () => import('@/ms/example'),
    meta: {
      title: '示例列表'
    }
  },
  {
    path: '/example/detail',
    component: () => import('@/ms/example/detail'),
    meta: {
      title: '示例详情'
    }
  }
]
