var path = require('path');
var fs = require('fs');
var baseConfig = require('./webpack.base.conf')
var nodeExternals = require('webpack-node-externals');
var Components = require('../components.json');

var externals = {};

Object.keys(Components).forEach(function(key) {
  externals[`e-ui/src/components/${key}`] = `e-ui/lib/${key}`;
});

externals = [Object.assign({
  vue: 'vue',
  'element-ui':'element-ui',
  '@element-ui': '@element-ui',
  'swiper': 'swiper',
  'quill': 'quill',
  '@axios': '@axios',
  '@areaJSON': '@areaJSON'
}, externals), nodeExternals()];

exports.externals = externals;

exports.alias = baseConfig.resolve.alias;

exports.vue = {
  root: 'Vue',
  commonjs: 'vue',
  commonjs2: 'vue',
  amd: 'vue'
};

exports.jsexclude = /node_modules/;
