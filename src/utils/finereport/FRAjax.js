var rq_user = '${=fr_username}';
var functions = this.options.form.getWidgetByName('functions').getValue();
var uid = this.options.form.getWidgetByName('uid').getValue();
var dates = this.options.form.getWidgetByName('dates').getValue().toString();
var type = this.options.form.getWidgetByName('type').getValue();
var id_Data = this.options.form.getWidgetByName('log_id');
var event = this.options.form.getWidgetByName('event').getValue();
var id = this.options.form.getWidgetByName('functions_id').getValue();
var today = FR.remoteEvaluate('FORMAT(now(),"yyyy-MM-dd HH:mm:ss")');
//contentPane.refreshAllSheets()

if(functions === "道具-消耗" || functions === "道具-产出" ) {
	if (uid === "" || dates === "") {
		window.alert("参数不可为空");
		return false;
	} else {
		var rq_url = "http://115.159.248.97:8080/legao/pullDataLeGao" + "?user_name=" + rq_user + "&id=" + id + "&target_name=" + functions + "&param=" + "uid=" + uid + " and " + "dates=" + dates ;
	}
} else if (functions === "数值（货币）-消耗-事件查询" || functions === "数值（货币）-产出" ) {
	if (uid === "" || dates === "" || type === "") {
		window.alert("参数不可为空");
		return false;
	} else {
		var rq_url = "http://115.159.248.97:8080/legao/pullDataLeGao" + "?user_name=" + rq_user + "&id=" + id + "&target_name=" + functions + "&param=" + "uid=" + uid + " and " + "dates=" + dates + " and " + "currency_type=" + type ;
	}
} else if (functions === "查询当天的数据") {
	if (uid === "" || dates === "" || event === "") {
		window.alert("参数不可为空");
		return false;
	} else {
		var rq_url = "http://115.159.248.97:8080/legao/pullDataLeGao" + "?user_name=" + rq_user + "&id=" + id + "&target_name=" + functions + "&param=" + "event_name=" + event + " and " + "dates=" + dates ;
	}
} else if (functions === "非当天时间点附近1分钟的全部日志") {
	if (uid === "" || dates === "") {
		window.alert("参数不可为空");
		return false;
	} else {
		var rq_url = "http://115.159.248.97:8080/legao/pullDataLeGao" + "?user_name=" + rq_user + "&id=" + id + "&target_name=" + functions + "&param=" + "uid=" + uid + " and " + "dates=" + dates ;
	}
}else {
	if (uid === "" || dates === "") {
		window.alert("参数不可为空");
		return false;
	} else {
		var rq_url = "http://115.159.248.97:8080/legao/pullDataLeGao" + "?user_name=" + rq_user + "&id=" + id + "&target_name=" + functions + "&param=" + "uid=" + uid + " and " + "dates=" + dates  ;
	}
}

// window.alert(rq_url);

FR.ajax({
	url: rq_url,
	dataType:"jsonp", //跨域采用jsonp方式
	jsonpCallback:"success_jsonp",
	success:function(json,textStatus,xOptions){
    console.log(json, xOptions, textStatus)
    //{"create_time":1584361796021,"err_log":"每个用户并行任务最多2个，请不要频繁提交！","exec_state":"拒绝执行",
    // "id":"e4f957b6-1268-4b49-ad43-5f9ca88fec65","target_name":"查询玩家非当天充值成功失败黑卡充值日志","user_name":"yaoxin1"}
    if (json.exec_state && json.exec_state == '拒绝执行') {
      window.alert(json.err_log);
    } else {
      id_Data.setValue(json.id);
      contentPane.setCellValue("A3", null, json.id);
      // console.log(_g().parameterCommit());
      setTimeout($("#fr-btn-FORMSUBMIT1").trigger("click"), 3000);
    }
	},
	error:function(xOptions,textStatus){
    console.log(xOptions, textStatus)
		// console.log("jsonp.error:"+textStatus+", rel="+xOptions.data.rel);
	}
});

alert("提交成功,打包中,请稍等.......");

return false;




/**
 * 分割线
 */


var test = this.options.form.getWidgetByName('formSubmit0');

test.setEnable(false);
$("#fr-btn-FORMSUBMIT0").text("查询中....");
//	$("#fr-btn-BUTTON2").trigger("click");

var log_id = this.options.form.getWidgetByName('log_id').getValue();
var url = "http://115.159.248.97:8080/legao/getLegaoByIdList?id=" + log_id;

console.log(url);

function getlog() {
	FR.ajax({
		url: url,
		dataType: "jsonp", //跨域采用jsonp方式
		jsonpCallback: "success_jsonp",
		success: function (data,textStatus,xOptions) {
			console.log(data);
			contentPane.setCellValue("A3", null, data[0].id);
			contentPane.setCellValue("B3", null, data[0].target_name);
			contentPane.setCellValue("C3", null, data[0].user_name);
			contentPane.setCellValue("D3", null, data[0].err_log);
			contentPane.setCellValue("E3", null, data[0].exec_state);
			contentPane.setCellValue("F3", null, data[0].file_name);
			contentPane.setCellValue("G3", null, data[0].file_path);
			// const downloadlink = "<a href='http://115.159.248.97:8080/downFile?filename=" + data[0].file_name + "&downloadPath=" + data[0].file_path + "'>下载</a>";
			const downloadlink = "http://115.159.248.97:8080/downFile?filename=" + data[0].file_name + "&downloadPath=" + data[0].file_path;
//			contentPane.setCellValue("H3", null, "<a href='" + downloadlink + "'>下载</a>");  // 下载链接需要更改
			console.log(downloadlink);
//			const x = document.createElement("a");
//			// x.href = downloadlink;
//			x.setAttribute('href', downloadlink);
//			console.log('x', x);

			const I3 = document.getElementById('I3-0-0');
			I3.innerHTML = '<a href="' + downloadlink + '">下载</a >';

//			contentPane.setCellValue("H3", null, x);  // 下载链接需要更改
			contentPane.setCellValue("H3", null, data[0].create_time_ymd);
			console.log(data[0].err_log)
		},
		error: function (xOptions, textStatus) {
			console.log("jsonp.error:" + textStatus + ", rel=" + xOptions.data.rel);
		}
	});
}

function retime(){
//	alert('刷新中....')
	var err_state =  $('td[id^=D3-]').text(); //获取E3单元格的值

//	alert(err_state)
	if(err_state == 'OK'){
		clearInterval(dingtime);
		test.setEnable(true);
		console.log('取消定时器');
		$("td[id^='I']").show();
		$("#fr-btn-FORMSUBMIT0").text("查询");
		}else if(err_state.indexOf("error") > -1 ) {
    			clearInterval(dingtime);
    			test.setEnable(true);
    			$("#fr-btn-FORMSUBMIT0").text("查询")
		}else {
			getlog()
		}
	}
dingtime = setInterval(retime, 1000 * 5);













for (let index = 0; index < 10; index++) {
  contentPane.setCellValue(`A${index}`, null, Math.random() * 100);
  // contentPane.setCellValue("B3", null, Math.random() * 100);
  // contentPane.setCellValue("C3", null, Math.random() * 100);
  // contentPane.setCellValue("D3", null, Math.random() * 100);
  // contentPane.setCellValue("E3", null, Math.random() * 100);
  // contentPane.setCellValue("F3", null, Math.random() * 100);
  // contentPane.setCellValue("G3", null, Math.random() * 100);
}