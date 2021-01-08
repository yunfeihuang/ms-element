# 开发组件到发布Npm流程
### step1: src/components/目录下创建vue组件(二维码组件示例)
```
<template>
  <div class="qr-code" style="display:inline-block"></div>
</template>

<script>
  export default {
    componentName: 'EQrCode', // componentName设置组件名称
    props: {
      text: {
        type: String,
        default: ''
      },
      height: {
        type: Number,
        default: 200
      },
      width: {
        type: Number,
        default: 200
      }
    },
    mounted () {
      require.ensure([], (r) => {
        let QRCode = require('qrcodejs2')
        this.$$qrcode = new QRCode(this.$el, {
          ...this.$props
        })
      })
    },
    watch: {
      text (value) {
        this.$$qrcode.clear()
        this.$$qrcode.makeCode(value)
      }
    },
    destroyed () {
      this.$$qrcode = null
    }
  }
</script>
#注意：组件内不要有style块，style块会增加cooking打包单文件的体积，如果增加样式请到src/components/styles/创建scss文件，并要在index.scss引入创建scss文件
```

### step2：在src/mds/目录下创建md文件，文件要和组件名保持一致，在src/nav.config.js配置markdown路由
```
  {
    path: '/qrcode',
    title: 'QrCode二维码'
  }
```

### step3：编辑md文件
```
  # 二维码
  <e-qr-code :text="text"></e-qr-code>
  ``` html
  <template>
    <e-qr-code :text="text"/>
  </template>
  <script>
    import EQrCode from 'e-ui/QrCode' // 这里引入组件要用e-ui别名
    export default {
      components: {
        EQrCode
      },
      data () {
        return {
          text: 'http://www.baidu.com'
        }
      },
      mounted () {
        setTimeout(() => {
          this.text = 'http://www.qq.com'
        }, 2000)
      }
    }
  </script>
  ``` html
  ### Extends
  [qrcodejs](https://github.com/davidshimjs/qrcodejs)

  ### Props
  | 参数      | 说明    | 类型      | 可选值       | 默认值   |
  |---------- |-------- |---------- |------------- |--------- |
  | text     | 二维码文本   | string  |   -       |    -    |
  | height     | 二维码图片高度   | number  |   -       |    200    |
  | width     | 二维码图片宽度   | number  |   -       |    200    |

  ### Events
  | 事件名称 | 说明 | 回调参数 |
  |---------|--------|---------|
  | - | - | - |

  ### Slots
  | 名称 | 说明 | 
  |---------|--------|
  | - | - |
  
  #更多markdown编写语法查看：https://markdown-it.github.io/
```

### step4：配置项目根目录下的components.json，cooking打包需要配置打包的文件
```
  "QrCode": "./src/components/QrCode",
```

### step5：项目打包，打包完成后会在lib目录生成对应的文件
```
  #样式主题打包
  npm run build:theme
  #组件打包
  npm run build:cooking
```

### step6：npm发布
```
  1.修改package.json版本号
  2.npm登录，需要输入帐号，密码及确认邮箱
    npm login
  3.发布
    npm publish
  
```