module.exports = function (designer) {
  return `export default {
  path: '${designer.setting.route.path}',
  meta: {
    group: '${designer.setting.route.meta.group || ''}',
    title: '${designer.setting.route.meta.title}'
  },
  component: () => import('@/views/${designer.setting.dir}/index.vue')
}
`
}