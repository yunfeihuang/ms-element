const requireComponent = require.context('../views/', true, /route\.js$/) // 找到view文件夹下以route.js命名的文件
let routes = []
requireComponent.keys().forEach(fileName => {
  routes.push(requireComponent(fileName).default)
})

export default routes