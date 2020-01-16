'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

// 配置需要 双重引号 
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://192.168.96.242:37799/webroot/decision"'
  // BASE_API: '"http://192.168.96.85:37799/webroot/decision"'
  BASE_API: '"http://bi.battleofballs.com/webroot/decision"'
})
