// 关系图构造器
; (function () {

  // 将服务器数据解析为echarts需要的格式
  var group = function (data, def) {
    
    var nodes = [];
    var links = [];
    var cat_dict = {}
    var categories = [];
    var len = data[def.nodename].length;
    for (var cat_k = 0; cat_k < len; cat_k++) {
      if (!cat_dict[data[def.cat][cat_k]]) {
        // 为空时特殊化处理，随便赋值一个不易重复的值
        data[def.cat][cat_k] ? cat_dict[data[def.cat][cat_k]] = cat_k : cat_dict['___##@@'] = cat_k;       // {"卡顿":1, "xxx":2}
        data[def.cat][cat_k] ? categories.push({name: data[def.cat][cat_k]}) : categories.push({name: data[def.nodename][cat_k]});
      }
    }

    for (var i = 0; i < len; i++) {
      var nodename = data[def.nodename][i];
      var size = data[def.size][i];
      var cat = data[def.cat][i];

      nodes.push({
        "id": i,
        "name": nodename,
        "itemStyle": null,
        "symbolSize": size,
        "value": 0,
        "attributes": {
          "modularity_class": cat_dict[cat] ? cat_dict[cat] : cat_dict['___##@@'],
        },
        "label": {
          "show": true
        },
        "cat": cat,
        "category": cat_dict[cat] ? cat_dict[cat] : cat_dict['___##@@']
      })
    }

    for (let index = 0; index < len; index++) {
      var nodelinks = data[def.links][index];
      var cat = data[def.cat][index];
      var nodename = data[def.nodename][index];
      if (nodelinks && nodelinks.length > 0) {
        var temps = nodelinks.split(',');
        for (let j = 0; j < temps.length; j++) {
          const element = temps[j];
          let node = nodes.find((n) => {
            if (cat && cat.length > 0) {
              return n.name == element && n.cat == cat;
            } else {
              return n.name == element;
            }
          })
          if(node) {
            links.push({
              "id": index + '_' + j,
              "name": nodename + '_' + element,
              "cat": nodename,
              "source": index,
              "target": node.id,
              "lineStyle": { "normal": {} }
            })
          } else {
            console.log(element, cat, nodename)
          }
        }
      }
    }
    
    return {
      nodes: nodes,
      links: links,
      categories: categories
    };
  };

  $.extend(FR.ECharts.MAKERS, {
    /**
     * 花状关系图图的数据构造器，
     * @param datas 服务端获取到的数据
     * @param def   配置的描述，比如什么是分类，什么是系列，什么是值等等的，用于辅助配置的生成，根据开发者的习惯自己定义即可
     * @return 生成好的数据配置
     */
    miserables: function (options, datas, def) {
      var graph = group(datas, def);

      var op_symbolSize = {
        max: 400,  // 球的最大值
        min: 200,  // 球的最小值
        narrow: 3, // 缩小的倍数
        showlable: 1  // 多大的时候显示文字
      }
      Object.assign(op_symbolSize, def.symbolSize);
      var op_force = {
        repulsion: 40,
        edgeLength: 70,
        layoutAnimation: false
      }
      Object.assign(op_force, def.force);

      graph.nodes.forEach(function (node) {
        node.value = node.symbolSize;
        node.symbolSize = Math.max(Math.min(node.symbolSize, op_symbolSize.max), op_symbolSize.min);
        node.symbolSize /= op_symbolSize.narrow;
        node.label = {
            show: node.symbolSize > op_symbolSize.showlable
        };
      });
      //生成标题
      var title = def.title.text;
      var option = {
        title: {
          text: title,
          subtext: 'Default layout',
          top: 'bottom',
          left: 'right'
        },
        tooltip: {},
        legend: [{
          // selectedMode: 'single',
          data: graph.categories.map(function (a) {
            return a.name;
          })
        }],
        animationDuration: 500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            name: '用户反馈主题关系',
            type: 'graph',
            layout: 'force',
            data: graph.nodes,
            links: graph.links,
            categories: graph.categories,
            roam: true,
            focusNodeAdjacency: true,
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1,
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            },
            label: {
              position: 'right',
              formatter: '{b}'
            },
            lineStyle: {
              color: 'source',
              curveness: 0.3
            },
            emphasis: {
              lineStyle: {
                width: 5
              }
            },
            force: { //力引导图基本配置
              //initLayout: ,//力引导的初始化布局，默认使用xy轴的标点
              repulsion: op_force.repulsion,//节点之间的斥力因子。支持数组表达斥力范围，值越大斥力越大。
              // gravity : 0.05,//节点受到的向中心的引力因子。该值越大节点越往中心点靠拢。
              edgeLength: op_force.edgeLength,//边的两个节点之间的距离，这个距离也会受 repulsion。[10, 50] 。值越小则长度越长
              layoutAnimation: op_force.layoutAnimation
              //因为力引导布局会在多次迭代后才会稳定，这个参数决定是否显示布局的迭代动画，在浏览器端节点数据较多（>100）的时候不建议关闭，布局过程会造成浏览器假死。                         
            },
          }
        ]
      };

      return option;
    }
  });

})();