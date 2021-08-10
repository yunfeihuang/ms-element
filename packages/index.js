import FrameLayout from './frame-layout'
import Drawer from './drawer'
import PageListLayout from './page-list-layout'
import Preview from './preview'
import {Form, FormItem} from './form'
import SearchForm from './search-form'

const components = [
  FrameLayout,
  Drawer,
  PageListLayout,
  Preview,
  Form,
  FormItem,
  SearchForm
]
const install = (Vue) => {
  window.Vue = Vue
  components.map(component => {
    component.name && Vue.component(component.name, component)
  })
}

export {
  install,
  FrameLayout,
  Drawer,
  PageListLayout,
  SearchForm
}
