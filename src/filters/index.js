/*
对Date的扩展，将 Date 转化为指定格式的String
月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
(new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
(new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
*/
Date.prototype.format = function (fmt = 'yyyy-MM-dd') { //eslint-disable-line
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'H+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt
}
export default {
  toAmount (value) {
    if (!value) return ''
    // 金额转换 分->元 保留2位小数 并每隔3位用逗号分开 1,234.56
    let str = (value / 100).toFixed(2) + ''
    let intSum = str.substring(0, str.indexOf('.')).replace(/\B(?=(?:\d{3})+$)/g, ',') // 取到整数部分
    let dot = str.substring(str.length, str.indexOf('.')) // 取到小数部分搜索
    return intSum + dot
  },
  dateFormat (value, format) {
    return new Date(value).format(format)
  }
}
