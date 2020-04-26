; (function () {
  var group = function (data, def) {
    var xs = [];
    var ss = [];
    var vs = [];
    var len = data[def.xKey].length;
    for (var i = 0; i < len; i++) {
      var xv = data[def.xKey][i];
      if (-1 == xs.indexOf(xv)) {
        xs.push(xv);
      }
      var sv = data[def.sKey][i];
      if (-1 == ss.indexOf(sv)) {
        ss.push(sv);
      }
      var vv = data[def.vKey][i];
      var xIdx = xs.indexOf(xv);
      var sIdx = ss.indexOf(sv);
      vs[sIdx] = vs[sIdx] || [];
      vs[sIdx][xIdx] = vs[sIdx][xIdx] || 0;
      vs[sIdx][xIdx] += vv;
    }
    return {
      xs: xs,
      ss: ss,
      vs: vs
    };
  };
  $.extend(FR.ECharts.MAKERS, {
    /**
     * 基础柱形图的数据构造器，
     * @param datas 服务端获取到的数据
     * @param def        配置的描述，比如什么是分类，什么是系列，什么是值等等的，用于辅助配置的生成，根据开发者的习惯自己定义即可
     * @return 生成好的数据配置
     */
    dms_bar: function (options, datas, def) {
      var gp = group(datas, def);
      //生成标题
      var title = def.title;
      //生成x轴【分类】配置
      var xAxis = [];
      xAxis.push({
        type: 'category',
        data: gp.xs
      });
      //生成y轴【值】配置
      var yAxis = [];
      yAxis.push({
        type: 'value'
      });
      //生成系列配置和示例
      var data = [];
      var series = [];
      for (var i = 0; i < gp.ss.length; i++) {
        var sitem = {};
        sitem.name = gp.ss[i];
        sitem.type = 'bar';
        sitem.data = gp.vs[i];
        series.push(sitem);
        data.push(sitem.name);
      }
      var legend = {
        data: data
      };
      //合并配置
      return {
        title: title,
        legend: legend,
        xAxis: xAxis,
        yAxis: yAxis,
        series: series
      };
    }
  });
})();