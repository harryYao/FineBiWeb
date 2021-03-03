
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
