'use strict'
import navigator from './navigator'
import mixins from './mixins'
import useFetch from './useFetch'
import useForm from './useForm'
import usePageList from './usePageList'
import restful from './restful'

let _default = {
  mixins,
  navigator,
  restful,
  useFetch,
  useForm,
  usePageList
}
window.$ms = _default
export default _default
