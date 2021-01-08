import {Marquee, MarqueeItem} from './marquee'
import Icon from './icon'
import Img from './img'
import Password from './password'
import ImgCode from './img-code'
import SmsCode from './sms-code'
import EmailCode from './email-code'
import Placeholder from './placeholder'
import Developing from './developing'
import Preview from './preview'
import Figure from './figure'
import Title from './title'
import DropdownGroup from './dropdown-group'
import ScrollInView from './scroll-in-view'
import Sticky from './sticky'
import Banner from './banner'

const components = [
  Icon,
  Img,
  Password,
  ImgCode,
  SmsCode,
  EmailCode,
  Marquee,
  MarqueeItem,
  Placeholder,
  Developing,
  Preview,
  Figure,
  Title,
  DropdownGroup,
  ScrollInView,
  Sticky,
  Banner
]
const install = (Vue) => {
  components.map(component => {
    component.componentName && Vue.component(component.componentName, component)
  })
}

export {
  install,
  Icon,
  Img,
  Password,
  ImgCode,
  SmsCode,
  EmailCode,
  Marquee,
  MarqueeItem,
  Placeholder,
  Developing,
  Preview,
  DropdownGroup,
  ScrollInView,
  Sticky,
  Banner
}
