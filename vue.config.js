const path = require('path')
const fs = require('fs')
//const webpack = require('webpack')
const MSDevServer = require('ms-designer/devServer')
// var Components = require('./components.json');

function resolve (dir) {
  return path.join(__dirname, './', dir)
}

module.exports = {
  productionSourceMap: process.env.Component === 'component' ? false : true,
  outputDir: process.env.Component === 'component' ? 'lib' : 'dist',
  devServer: {
    overlay: {
      error: false
    },
    proxy: {
      '/designer/': {
        target: 'http://mselement.bittyos.com/'
      },
      '/designer-api/': {
        target: 'http://mselement.bittyos.com/',
        changeOrigin: true
      }
    },
    before (app) {
      MSDevServer(app, path.join(__filename, '../'))
    }
  },
  pages: {
    index: {
       // page 的入口
       entry: 'src/main.js',
       // 模板来源
       template: 'public/index.html',
       // 在 dist/index.html 的输出
       filename: 'index.html',
       // 当使用 title 选项时，
       // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
       title: 'MS Element',
       // 在这个页面中包含的块，默认情况下会包含
       // 提取出来的通用 chunk 和 vendor chunk。
       chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    demo: {
       // page 的入口
       entry: 'src/demo.js',
       // 模板来源
       template: 'public/index.html',
       // 在 dist/index.html 的输出
       filename: 'demo.html',
       // 当使用 title 选项时，
       // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
       title: 'MS Element Demo',
       // 在这个页面中包含的块，默认情况下会包含
       // 提取出来的通用 chunk 和 vendor chunk。
       chunks: ['chunk-vendors', 'chunk-common', 'demo']
    }
  },
  configureWebpack: config => {
    /*
    config.plugins.push(new webpack.ProvidePlugin({
      ms: [resolve('./packages/ms.js'), 'default']
    }))
    */
    if (process.env.Component === 'component') {
      config.plugins = config.plugins.filter(item  => {
        return ['HtmlWebpackPlugin', 'CopyPlugin', 'ESLintWebpackPlugin'].indexOf(item.constructor.name) === -1
      })
      config.performance = {
        hints: false
      }
      config.stats = {
        children: false
      }
      config.optimization = {
        minimize: true
      }
      var Components = {
        "index": "./packages",
        "ms": "./packages/ms.js",
        "navigator": "./packages/navigator.js",
        "restful": "./packages/restful.js",
        "mixins/fetch": "./packages/mixins/fetch.js",
        "mixins/form": "./packages/mixins/form.js",
        "mixins/pageList": "./packages/mixins/pageList.js",
        "mixins/index": "./packages/mixins/index.js",
        "hooks/index": "./packages/hooks/index.js",
        "hooks/useFetch": "./packages/hooks/useFetch.js",
        "hooks/useForm": "./packages/hooks/useForm.js",
        "hooks/usePageList": "./packages/hooks/usePageList.js"
      }
      var ComponentsPath = './packages'
      const files = fs.readdirSync(ComponentsPath)
      files.forEach(function (item) {
          let p = ComponentsPath + "/" + item
          let stat = fs.lstatSync(p)
          if (stat.isDirectory() === true && ['style'].indexOf(item) == -1) { 
            Components[item] = p
          }
      })
      config.entry = Components

      config.externals = {
        'vue': 'vue',
        'axios': 'axios',
        'element-plus': 'element-plus',
        'vue-router': 'vue-router',
        ...config.externals
      }
      config.output.filename = '[name].js'
      config.output.chunkFilename = '[id].js'
      config.output.libraryTarget = 'commonjs2'
    }
    // console.log('plugins', config.module.rules)
  },
  chainWebpack: config => {
    config.resolve.alias.set('ms-element', resolve('packages'))
    config.module
    .rule("md")
    .test(/\.md/)
    .use("vue-loader")
    .loader("vue-loader")
    .end()
    .use("vue-markdown-loader")
    .loader("vue-markdown-loader/lib/markdown-compiler")
    .options({
      raw: true,
      preventExtract: true,
      preprocess: function(markdownIt, source) {
        var result = source.match(/##:(\w+):##/g)
        if (result && result[0]) {
          var component = result[0].replace(/##:/g, '').replace(/:##/g, '')
          if (component) {
            var text = fs.readFileSync(resolve('src/demos/'+component+'.vue'), 'utf8')
            return source.replace(result[0], text).replace(RegExp(`.scss`, 'g'), '.css')
          }
        }
        // do any thing
        return source
      }
    })
    const oneOfsMap = config.module.rule('scss').oneOfs.store
    oneOfsMap.forEach(item => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          // Or array of paths
          resources: ['./packages/style/src/theme/common/variable.scss', './packages/style/src/theme/common/mixins.scss']
        })
        .end()
    })
  }
}