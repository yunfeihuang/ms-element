module.exports = {
  objectToProps: function (object) {
    let result = []
    Object.keys(object).forEach(key => {
      if (![undefined, null, ""].includes(object[key])) {
        result.push(`${typeof object[key] == 'string' ? '':':'}${key}="${object[key]}"`)
      }
    })
    return result.join(' ')
  },
  arrayToValue: function (array) {
    let result = array.map(item => {
      let stringify = JSON.stringify(item)
      Object.keys(item).forEach(key => {
        stringify = stringify.replace(`"${key}":`, `${key}:`)
      })
      return stringify.replace(/"/g, '\'')
    })
    return `[${result.join(',')}]`
  }
}