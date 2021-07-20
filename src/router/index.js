const Layout = {
  template: `<router-view/>`
}

export default [
  {
    path: '/',
    component: () => import('@/example/console'),
    meta: {
      title: '控制台',
      keepAlive: true
    }
  },
  {
    path: '/profile',
    component: () => import('@/example/profile/index.vue'),
    meta: {
      title: '个人中心',
      keepAlive: true
    },
    children: [
      {
        path: '',
        component: () => import('@/example/profile/info.vue'),
        meta: {
          title: '个人中心-资料'
        }
      },
      {
        path: '/profile/follow',
        component: () => import('@/example/profile/follow.vue'),
        meta: {
          title: '个人中心-关注'
        }
      },
      {
        path: '/profile/others',
        component: () => import('@/example/profile/others.vue'),
        meta: {
          title: '个人中心-其他'
        }
      }
    ]
  },
  {
    path: '/message',
    component: () => import('@/example/message/index.vue'),
    meta: {
      title: '消息'
    }
  },
  {
    path: '/message/detail',
    component: () => import('@/example/message/detail.vue'),
    meta: {
      title: '消息详情'
    }
  },
  {
    path: '/user',
    component: () => import('@/example/user'),
    meta: {
      title: '示例列表',
      keepAlive: true
    }
  },
  {
    path: '/user/detail',
    component: () => import('@/example/user/detail'),
    meta: {
      title: '示例详情'
    }
  },
  {
    path: '/user2',
    component: Layout,
    meta: {
      title: '用户管理'
    },
    children: [
      {
        path: '/user2',
        component: () => import('@/example/user'),
        meta: {
          title: '示例列表2'
        }
      },
      {
        path: '/user2/detail',
        component: () => import('@/example/user/detail'),
        meta: {
          title: '示例详情2'
        }
      }
    ]
  }
]
