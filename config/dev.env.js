'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

// 配置需要 双重引号 
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"/webroot/decision"',
  AssetsPublicPath: '"/"'
})
