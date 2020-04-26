// var echarts = require('echarts/lib/echarts')
// echarts.dataTool = require('echarts/extension/dataTool')
// $.get('https://echarts.apache.org/examples/data/asset/data/les-miserables.gexf', function(xml){

//   console.log('初始化', FR.ECharts.dataTool);
//   // var graph = FR.ECharts.dataTool.gexf.parse(xml);
//   console.log('getxml:', xml);
// })

FR.ECharts.create(this,{
        js:['dms/bar.js','oms/bar.js'],
        ds:{
                name:'ds1',
                cols:'地区,销售员,销量'
        },
        def:{
                title:{
                        text:'销量表'
                },
                xKey: '地区',
                sKey: '销售员',
                vKey: '销量'
        },
        clickSeries:function( name, series, value ){
                FR.BaseUtils.linkChart('chart1',{saler:series});
        }
});
