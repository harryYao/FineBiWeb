# FineBiWeb

> 这是一个基于帆软FineBI报表平台改造的一个壳应用   
> https://help.fanruan.com/finebi/   
> 用于改善 目录结构较多较深的报表平台  
> 使用体验有较多的提升  
> 同时可以加入自己开发的web页面  
> 使得该报表应用的使用性大大扩展


## 框架

> 本项目框架基于 vue init webpack FineBiWeb  

## 构建过程

``` bash
# 安装FineBI服务
# https://help.fanruan.com/finebi/doc-view-260.html

# 下载本项目，安装依赖
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

```

## 配置目录

> 修改配置文件 src/utils/setting  
> 根据帆软应用的目录结构，找到目录的对应id进行配置。  
> 不知道如何找id？ 可以先配置menu，然后启动 npm run dev, 自己点开也买你，路由中就有id
> 
```

export default {
  // 通过配置BI目录，设置一个仪表板，只有一个web组件，嵌入一个页面（）
  vuePagePaths: {
    '00a9e37f-ca1f-49cc-bb0b-f30f27f7ad1f': '/testpage'
  },
  // 配置需要显示的一级菜单
  menu: [
    { name: '财务部门', icon: 'caiwu.png' },
    { name: '销售部门', icon: 'xiaoshou.png' },
    { name: '客服', icon: 'kefu.png' }
  ],
  // 切换下拉框（一级目录），或者切换顶部模块（二级目录），可以配置默认打开的页面
  games: [
    {
      name: '财务部门',
      tabs: [
        {
          name: '概览',
          mainid: '37264d12-7597-4ee7-9068-3dd6633b108f',
        },
        {
          name: '支出',
          mainid: '00efb90d-0e0b-4d94-ae87-36593d6e231d',
        },
        {
          name: '自定义页面',
          mainid: '00a9e37f-ca1f-49cc-bb0b-f30f27f7ad1f',
        },
      ],
    },
    {
      name: '销售部门',
      tabs: [
        {
          name: '分析报表',
          mainid: 'a52d8875-7e31-413a-bcce-5c7059b554db',
        },
      ],
    },
    {
      name: '客服',
      tabs: [
        {
          name: '今日',
          mainid: 'f880ddb1-03dc-4559-9d4f-b7658f8770db',
        },
        {
          name: '历史',
          mainid: '06414653-8e00-460b-9ea1-99e185a53e85',
        }
      ]
    }
  ]
};

```


## 部署

```
# build for production with minification
npm run build

# 将 /dist 文件内的全部文件 copy 到 ../FineBI5.1/webapps/webroot
# 打开 http://localhost:37799/webroot/#  即可看到部署后页面

```