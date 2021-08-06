const requireComponent = require.context('.', true, /\.vue$/) // 找到components文件夹下以.vue命名的文件
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  const component = componentConfig.default || componentConfig
  if (component.route && window.$app) {
    window.$app.$router.addRoutes([{
      ...component.route,
      component
    }])
  }
})