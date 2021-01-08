import {Summary, SummaryItem} from './summary'
import {Marquee, MarqueeItem} from './marquee'
import Icon from './icon'
import Breadcrumb from './breadcrumb'
import Img from './img'
import Password from './password'
import ImgCode from './img-code'
import SmsCode from './sms-code'
import EmailCode from './email-code'
import InputNumberRange from './input-number-range'
import FrameLayout from './frame-layout'
import PageListLayout from './page-list-layout'
import DetailLayout from './detail-layout'
import Placeholder from './placeholder'
import Developing from './developing'
import Preview from './preview'
import PaymentMethod from './payment-method'
import ImgUpload from './img-upload'
import Section from './section'
import Danger from './danger'
import DropdownGroup from './dropdown-group'
import AreaCascader from './area-cascader'

const components = [
  Icon,
  Breadcrumb,
  Img,
  Password,
  ImgCode,
  SmsCode,
  EmailCode,
  InputNumberRange,
  FrameLayout,
  PageListLayout,
  DetailLayout,
  Summary,
  SummaryItem,
  Marquee,
  MarqueeItem,
  Placeholder,
  Developing,
  Preview,
  PaymentMethod,
  Section,
  Danger,
  ImgUpload,
  AreaCascader,
  DropdownGroup
]
const install = (Vue) => {
  Vue.prototype.$open = function (title, to, props) {
    let src = ''
    let AsyncComponent = null
    if (to instanceof Promise) {
      AsyncComponent = () => ({
        loading: {
          template: `
            <div class="el-loading-spinner"
              style="padding:20px;margin:0;position: static;width:auto;">
              <svg viewBox="25 25 50 50" class="circular">
                <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
              </svg>
            </div>
          `
        },
        component: to
      })
    } else {
      src = `${this.$router.mode === 'history' ? '' : window.location.pathname}${this.$router.resolve(to).href}`
    }
    let node = document.createElement('div')
    document.body.appendChild(node)
    new Vue({ // eslint-disable-line
      el: node,
      parent: this,
      router: this.$router,
      store: this.$store,
      data () {
        return {
          visible: false
        }
      },
      mounted () {
        this.visible = true
      },
      render (createElement) {
        return (
          <el-dialog custom-class="e-dialog-iframe"
            visible={this.visible}
            title={title}
            destroy-on-close={true}
            append-to-body={false}
            width="90%"
            top="5vh"
            onOpened={this.handleOpened}
            onClose={this.handleClose}>
            {AsyncComponent ? <AsyncComponent {...{ attrs: props }}/> : <iframe src={src} frameborder="0" onLoad={this.handleLoad}></iframe>}
          </el-dialog>
        )
      },
      methods: {
        handleClose () {
          this.visible = false
        },
        handleOpened () {
          if (!AsyncComponent) {
            this.$loadingInstance = this.$loading({ // 实例化loading对象
              target: this.$el.querySelector('.el-dialog__body'),
              fullscreen: false
            })
          }
        },
        handleLoad () {
          setTimeout(() => {
            this.$loadingInstance && this.$loadingInstance.close()
          }, 300)
        }
      }
    })
  }
  components.map(component => {
    component.componentName && Vue.component(component.componentName, component)
  })
}

export {
  install,
  Icon,
  Breadcrumb,
  Img,
  Password,
  ImgCode,
  SmsCode,
  EmailCode,
  InputNumberRange,
  FrameLayout,
  PageListLayout,
  DetailLayout,
  Summary,
  SummaryItem,
  Marquee,
  MarqueeItem,
  Placeholder,
  Developing,
  Preview,
  PaymentMethod,
  Section,
  Danger,
  ImgUpload,
  AreaCascader,
  DropdownGroup
}
