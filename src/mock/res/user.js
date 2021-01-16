export default {
  get () {
    let data = []
    for (let i = 0; i < 20; i++) {
      data.push({
        id: Math.random().toString(),
        date: new Date().toLocaleString(),
        name: `张三${i}`,
        address: `上海市普陀区金沙江路${i}号`,
        age: Math.floor(Math.random() * 100),
        email: `${Math.floor(Math.random() * 100000000)}@qq.com`,
        state: '启用',
        url: '/static/images/img_qr.jpg',
        sex: '男',
        hoppy: ['足球', '篮球'],
        start_time: new Date().toLocaleString(),
        end_time: new Date().toLocaleString(),
        desc: '如果出现发生系统错误 1067 请把db目录下的mongod.lock文件删除后重新输入net start MongoDB启动服务即可'
      })
    }
    return {
      count: 1000,
      data
    }
  },
  post () {
    return {
      id: Math.random().toString(),
      date: new Date().toLocaleString(),
      name: `张三`,
      address: `上海市普陀区金沙江路号`,
      age: Math.floor(Math.random() * 100),
      email: `${Math.floor(Math.random() * 100000000)}@qq.com`,
      state: '启用',
      url: '/static/images/img_qr.jpg',
      sex: '男',
      hoppy: ['足球', '篮球'],
      start_time: new Date().toLocaleString(),
      end_time: new Date().toLocaleString(),
      desc: '如果出现发生系统错误 1067 请把db目录下的mongod.lock文件删除后重新输入net start MongoDB启动服务即可'
    }
  },
  delete () {
    return null
  }
}
