# FineBiWeb

> A Vue.js project 

## dev Setup

``` bash
# install dependencies
npm install

# 配置FineBI的地址
在config/dev.env.js 文件中配置 你自己部署的 BASE_API: '"http://192.168.1.123:37799/webroot/decision"'
注意是双重引号

# serve with hot reload at localhost:8080
npm run dev

# 在FineBi 创建 新建仪表板，添加其他组件中的web组件
编辑地址为 http://localhost:8080 或者你的IP 地址 http://192.168.1.123:8080


就可以看到测试页面了。

```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

![测试列表页面](/static/img1.png)



![返回结果json可视化](/static/img2.png)
