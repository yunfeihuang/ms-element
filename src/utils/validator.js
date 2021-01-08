const pattern = {
  email: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
  mobile: /^1[3|4|5|6|7|8|9][0-9]{9}$/,
  phone: /^0\d{2,3}-?\d{7,8}$/, // 座机
  password: /^[A-Za-z0-9]{8,20}$/,
  gt0: /^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$/, // 大于0
  money: /^[0-9]+(\.[0-9]{1,2})?$/,
  ID: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
}

export default {
  pattern,
  rule: {
    email: {
      pattern: pattern.email,
      message: '邮箱格式不正确'
    },
    phone: {
      pattern: pattern.phone,
      message: '电话号码格式不正确'
    },
    mobile: {
      pattern: pattern.mobile,
      message: '手机号码格式不正确'
    },
    gt0: {
      pattern: pattern.gt0,
      message: '请输入大于0的数字'
    },
    money: {
      pattern: pattern.money,
      message: '请输入有效的金额数字'
    },
    ID: {
      pattern: pattern.ID,
      message: '请输入有效的身份证号码'
    },
    password: {
      pattern: pattern.password,
      message: '密码格式不正确'
    }
  }
}
