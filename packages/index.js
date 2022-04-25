import FrameLayout from './frame-layout'
import PageListLayout from './page-list-layout'
import SearchForm from './search-form'
import Drawer from './drawer'
import navigator from './navigator'

const components = [
  FrameLayout,
  PageListLayout,
  SearchForm,
  Drawer
]
const install = (app) => {
  components.map(component => {
    component.name && app.component(component.name, component)
  })
  app.config.globalProperties.$navigator = navigator
}
export default {
  install,
  FrameLayout,
  PageListLayout,
  SearchForm,
  Drawer
}
