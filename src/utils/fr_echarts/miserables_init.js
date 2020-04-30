
// lable 初始化事件里面添加
var temp = FR.ECharts.create(this, {
  js: ['miserables.js'],
  ds: {
    name: '关系图',
    cols: 'nodename,size,cat,links'
  },
  def: {
    title: {
    	 text: '关系图'
    },
    nodename: 'nodename',
    size: 'size',
    cat: 'cat',
    links: 'links',
    symbolSize: {
      max: 300,
      min: 20,
      narrow: 3,
      showlable: 0
    },
    force: {
		  repulsion: 100,
		  edgeLength: 50,
		  layoutAnimation: true
    }
  },
  clickSeries: function() {
//  	console.log(arguments);
//  	if ($("#"+arguments[0]).offset()) {
//  		$(".reportContent").scrollTop($("#"+arguments[0]).offset().top - $(".reportContent").offset().top + $(".reportContent").scrollTop());
//  	}
  }
});

temp.chart.on('click', function(param){
  console.log(param);
  if (param.dataType == 'node') {
    const id = '#' + param.data.cat + '_' + param.data.name;
    
    if ($(id).offset()) {
      const h = $(id).offset().top - $(".reportContent").offset().top + $(".reportContent").scrollTop();
      $(".reportContent").animate({scrollTop: h + 'px'}, 300);
    } else if (param.data.cat && param.data.cat == param.data.name) {      
      const h = $('.' + param.data.name).offset().top - $(".reportContent").offset().top + $(".reportContent").scrollTop();
      $(".reportContent").animate({scrollTop: h + 'px'}, 300);
    } else if (param.data.cat == '') {
      $(".reportContent").animate({scrollTop: '0px'}, 300);
    }
  } else if (param.dataType == 'edge') {
    const id = '#' + param.data.name;
    if ($(id).offset()) {
      const h = $(id).offset().top - $(".reportContent").offset().top + $(".reportContent").scrollTop();
      $(".reportContent").animate({scrollTop: h + 'px'}, 300);
    // } else {
    //   const h = $('.' + param.data.cat).offset().top - $(".reportContent").offset().top + $(".reportContent").scrollTop();
    //   $(".reportContent").animate({scrollTop: h + 'px'}, 300);
    }
  }
});
