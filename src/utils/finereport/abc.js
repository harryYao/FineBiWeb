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