myChart.showLoading();
$.get(ROOT_PATH + 'data/asset/data/les-miserables.gexf', function (xml) {
    myChart.hideLoading();

    var graph = {};//echarts.dataTool.gexf.parse(xml);
    
    var glinklist = [];
    var gnodeslist = [];
	var glinks = [];
	var gnodes = [];
	
	var parent_nodes = ["用户反馈", "卡顿", "充值不到账", "挂机", "辱骂", "人机", "奖励问题", "氪金", "外挂", "游戏不好玩"];
    var datas = [
        "",
		"生存:7|皮肤:14|队友:6|逃杀:7|体验:20|提交:2|坑钱:5|充了:3|充值:7|频繁:5",
		"这笔:8|支付:5|福利:2|申述:2|金额:2|重复:6|四十一:2|提示:2|金蘑菇:13|充了:4",
		"体验:12|好友:2|恶意:2|合作:3|信誉值:2|匹配:14|恶意:2|队友:15|人机:5|全是:3",
		"语音:4|只会:3|队友:8|有人:6|文明:5|留言:3|投诉:4|房间:2|合作:8|解决不了:3",
		"惩罚:2|匹配:17|30:2|双冠模式:4|双冠:11|挂机:7|开局:2",
		"灵石:3|老玩家:3|月卡会员:4|领取:3|登录:2|六日:2|支付:3|礼包:3|三星:3|典藏:2",
		"邮箱:2|服务器:3|报告:2|整理:2|体验:2|报告:2|密码:6|忘记:3|早日:2|卡成:2",
		"帮球宝:2|找回:2|变身:2|早日:2|找回:2|队友:2|队友:2|双冠:2|早日:2|变身:2",
		"挂机:2|公平:2|账号:2|挂机:2|账号:2|挂机:2|公平:2|挂机:2|挂机:2|账号:2"
	];
	
	var word_id = parent_nodes.length;
	for (var parent_id in datas) {
		var data_arr = datas[parent_id].split("|");
		if (data_arr.length > 1) {
    		for (var i =0; i <= data_arr.length-1; i++) { 
    			var word = data_arr[i].split(":")[0];
    			var freq = data_arr[i].split(":")[1];
    			
    			//if (word in gwords_weight) {
    			//	gwords_weight[word] += tuple_counts*1;
    			//} else {
    			//	gwords_weight[word] = tuple_counts*1;
    			//}
    			
    			//if (-1 == gnodeslist.indexOf(word)) {
    			//	gnodeslist.push(word);
    			//}
    			
    			glinklist.push({
    				"source" :  parent_id*1,
    				"target" :  word_id*1,
    				"name" : parent_nodes[parent_id] + "->" + word
    			})
    			gnodeslist.push({
    				"id": word_id*1,
    				"word": word,
    				"symbolSize": freq*1,
    				"value": freq*1,
    				"modularity_class": parent_id*1
    			})
    			word_id++;
    		}
		}
	}
	
	for (var id in parent_nodes) {
	    gnodes.push({
            "id": id*1,
            "name": parent_nodes[id],
            "itemStyle": null,
            "symbolSize": 60,
            "value": 0,
            "attributes": {
                "modularity_class": id*1,
            },
            "label": {
                "show": false
            },
            "category": id
        });
	}
    gnodes[0]["symbolSize"] = 80;

    for (var id in gnodeslist) {
        gnodes.push({
            "id": gnodeslist[id]["id"]*1,
            "name": gnodeslist[id]["word"],
            "itemStyle": null,
            "symbolSize": gnodeslist[id]["symbolSize"],
            "value": gnodeslist[id]["value"],
            "attributes": {
                "modularity_class": gnodeslist[id]["modularity_class"],
            },
            "label": {
                "show": false
            },
            "category": gnodeslist[id]["modularity_class"]
        });
    }
    
    
    for (var i=1; i<parent_nodes.length; i++) {
	    glinks.push({
            "id": null, //id,
            "name": null,
            "source": 0,
            "target": i,
            "lineStyle": {"normal": {}}
        });
	}
	
	for (var id in glinklist) {
        glinks.push({
            "id": null, //id,
            "name": null,
            "source": glinklist[id]["source"]*1,
            "target": glinklist[id]["target"]*1,
            "lineStyle": {"normal": {}}
        });
        
        // if (id % 2 == 1) {
        //     glinks.push({
        //         "id": null, //id,
        //         "name": null,
        //         "source": glinklist[id]["target"]*1-1,
        //         "target": glinklist[id]["target"]*1,
        //         "lineStyle": {"normal": {}}
        //     });
        // }
    }
	
    graph.nodes = gnodes;
    graph.links = glinks;
    
    
    var categories = [];
    for (var parent_id in parent_nodes) {
        categories[parent_id] = {
            name: parent_nodes[parent_id]
        };
    }
	
    graph.nodes.forEach(function (node) {
        node.itemStyle = null;
        node.value = node.symbolSize;
        node.symbolSize /= 1.5;
        node.label = {
            show: node.symbolSize > 0
        };
        node.category = node.attributes.modularity_class;
    });
    console.log(graph.nodes);
    console.log(graph.links);
    
    
    option = {
        title: {
            text: '用户反馈主题关系图',
            subtext: 'Default layout',
            top: 'bottom',
            left: 'right'
        },
        tooltip: {},
        legend: [{
            // selectedMode: 'single',
            data: categories.map(function (a) {
                return a.name;
            })
        }],
        animationDuration: 1000,
        animationEasingUpdate: 'quinticInOut',
        series : [
            {
                name: '用户反馈主题关系',
                type: 'graph',
                layout: 'force',
                data: graph.nodes,
                links: graph.links,
                categories: categories,
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
                force : { //力引导图基本配置
                    //initLayout: ,//力引导的初始化布局，默认使用xy轴的标点
                    repulsion : 20,//节点之间的斥力因子。支持数组表达斥力范围，值越大斥力越大。
                    // gravity : 0.05,//节点受到的向中心的引力因子。该值越大节点越往中心点靠拢。
                    edgeLength : 30,//边的两个节点之间的距离，这个距离也会受 repulsion。[10, 50] 。值越小则长度越长
                    layoutAnimation : true
                    //因为力引导布局会在多次迭代后才会稳定，这个参数决定是否显示布局的迭代动画，在浏览器端节点数据较多（>100）的时候不建议关闭，布局过程会造成浏览器假死。                         
                },
            }
        ]
    };

    myChart.setOption(option);
}, 'xml');