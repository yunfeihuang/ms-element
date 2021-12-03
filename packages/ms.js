'use strict'
import navigator from './navigator'
import mixins from './mixins'
import use from './use'
import restful from './restful'

let _default = {
  use,
  mixins,
  navigator,
  restful
}
window.$ms = _default
export default _default
