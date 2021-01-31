import $axios from '@axios'

export default (url, axios = $axios) => {
  return {
    fetch (option) {
      let {url: _url, ...other} = option
      return axios({
        url: url + _url,
        ...other
      })
    },
    get (...args) {
      if (args.length > 0 && ['string', 'number'].indexOf(typeof args[0]) > -1) {
        return axios({
          url: url + '/' + args[0],
          ...args[1]
        })
      } else {
        return axios({
          url,
          ...args[0]
        })
      }
    },
    post (option) {
      return axios({
        url,
        method: 'POST',
        ...option
      })
    },
    put (option) {
      return axios({
        url,
        method: 'PUT',
        ...option
      })
    },
    delete (...args) {
      if (args.length > 0 && ['string', 'number'].indexOf(typeof args[0]) > -1) {
        return axios({
          url: url + '/' + args[0],
          method: 'DELETE',
          ...args[1]
        })
      } else {
        return axios({
          url: url + '/batch',
          method: 'DELETE',
          ...args[0]
        })
      }
    },
    patch (option) {
      let {url: _url, ...other} = option
      return axios({
        url: url + _url,
        method: 'PATCH',
        ...other
      })
    }
  }
}
