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
  app.config.globalProperties.getSize = (maxHeight) => {
    let result = undefined
    let height = window.innerHeight
    if (maxHeight && height > maxHeight) {
      height = maxHeight
    }
    if (height <= 700) {
      result = 'mini'
    } else if (height <= 800) {
      result = 'small'
    } else if (height <= 900) {
      result = 'medium'
    }
    return result
  }
  app.config.globalProperties.$navigator = navigator
}

export {
  install,
  FrameLayout,
  PageListLayout,
  SearchForm
}
