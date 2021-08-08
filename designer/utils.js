module.exports = {
  objectToProps: function (object) {
    if (object && Object.keys(object).length) {
      let result = Object.entries(object).map(item => {
        if (![undefined, null, ""].includes(item[1])) {
          return `${typeof item[1] == 'string' ? '':':'}${item[0]}="${item[1]}"`
        }
        return ''
      })
      return ' ' + result.filter(item => !!item).join(' ')
    } else {
      return ''
    }
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