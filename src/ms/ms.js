'use strict'
import navigator from './navigator'
import mixins from './mixins'
import restful from './restful'

let _default = {
  mixins,
  navigator,
  restful
}
window.$ms = _default
export default _default
