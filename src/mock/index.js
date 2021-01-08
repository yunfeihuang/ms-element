import axios from '@axios'
import adapter from 'axios-mock-adapter'
import res from './res'

export default () => {
  let mock = new adapter(axios, { delayResponse: 2000 }) // eslint-disable-line
  mock.onAny().reply(config => {
    console.log(config)
    let result = res.find(item => {
      return config.baseURL ? config.baseURL + item[1] : item[1] === config.url && item[0].toUpperCase() === config.method.toUpperCase()
    })
    if (result) {
      return [200, {
        code: 200,
        data: typeof result[2] === 'function' ? result[2](config) : result[2]
      }]
    }
  })
}
