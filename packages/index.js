import FrameLayout from './frame-layout'
import PageListLayout from './page-list-layout'
import SearchForm from './search-form'

const components = [
  FrameLayout,
  PageListLayout,
  SearchForm
]
const install = (app) => {
  components.map(component => {
    component.name && app.component(component.name, component)
  })
}

export {
  install,
  FrameLayout,
  PageListLayout,
  SearchForm
}
