
export default {
  // 通过配置BI目录，设置一个仪表板，只有一个web组件，嵌入一个页面（）
  vuePagePaths: {
    'fbd62ad2-7032-49b9-a992-648856870f9f': '/skin',
    'aaff1342-53d0-4b71-833c-f280f9a5dcac': '/feedback',
    '1448901d-9e31-4322-af57-ddfc84fcbdea': '/uploadcsv',
    '319ff229-5f85-4ad2-9b37-c502595c29cf': '/sqlquery',
    '9194dc93-55cd-4edc-8860-64ad4d3b9ff1': '/paidui_feedback',
  },
  /**
  * 切换下拉框（一级目录），或者切换顶部模块（二级目录），可以配置默认打开的页面
  */
  games: [
    {
      name: '财务部门',
      tabs: [
        {
          name: '概览',
          mainid: '53cdc453-22d8-430e-a459-f703b80701ee',
        },
        {
          name: '支出',
          mainid: 'c58c46bb-c69c-45d4-a9c0-a1a8bdbe3fda',
        },
      ],
    },
    {
      name: '销售',
      tabs: [
        {
          name: '分析报表',
          mainid: '6587bcda-1ed7-4e89-9c44-85051abc9451',
        },
      ],
    },
    {
      name: '客服',
      tabs: [
        {
          name: '今日',
          mainid: 'de44f49c-3c0b-4d3a-8d88-952dae0016a5',
        },
        {
          name: '历史',
          mainid: 'dcd001af-dd94-442a-8466-dbcab95771c6',
        }
      ]
    }
  ]
};
