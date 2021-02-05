import FrameLayout from './frame-layout'
import Drawer from './drawer'
import PageListLayout from './page-list-layout'
import Preview from './preview'
import {Form, FormItem} from './form'
import QueryForm from './query-form'

const components = [
  FrameLayout,
  Drawer,
  PageListLayout,
  Preview,
  Form,
  FormItem,
  QueryForm
]
const install = (Vue) => {
  components.map(component => {
    component.componentName && Vue.component(component.componentName, component)
  })
}

export {
  install,
  FrameLayout,
  Drawer,
  PageListLayout,
  QueryForm
}
