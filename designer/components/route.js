module.exports = function (designer) {
  return `export default {
  path: '${designer.setting.route.path}',
  meta: {
    title: '${designer.setting.route.meta.title}'
  },
  component: () => import('@/views/${designer.setting.dir}/index.vue')
}
`
}