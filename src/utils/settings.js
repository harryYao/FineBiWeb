
export default {
  // 通过配置BI目录，设置一个仪表板，只有一个web组件，嵌入一个页面（）
  vuePagePaths: {
    '00a9e37f-ca1f-49cc-bb0b-f30f27f7ad1f': '/testpage'
  },
  menu: [
    { name: '财务部门', icon: 'caiwu.png' },
    { name: '销售部门', icon: 'xiaoshou.png' },
    { name: '客服', icon: 'kefu.png' }
  ],
  /**
  * 切换下拉框（一级目录），或者切换顶部模块（二级目录），可以配置默认打开的页面
  */
  games: [
    {
      name: '财务部门',
      tabs: [
        {
          name: '行业应用',
          mainid: '3962ba93-cac7-4a12-ab10-197dc5a1f16a',
        },
        {
          name: '管理驾驶舱',
          mainid: 'c94b5c30-6b51-4639-a8fa-094d4a013e5a',
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
