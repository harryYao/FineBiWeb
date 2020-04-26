
// lable 初始化事件里面添加
FR.ECharts.create(this, {
  js: ['dms/miserables.js'],
  ds: {
    name: 'ds1',
    cols: '地区,销售员,销量'
  },
  def: {
    title: {
      text: '销量表'
    },
    node: '',
    num: '',
    parent: '',
    links: ''
  }
});