var rq_user = '${=fr_username}';
// var feedtype = this.options.form.getWidgetByName('feedtype').getValue();
// var uid = this.options.form.getWidgetByName('uid').getValue();
// var version = this.options.form.getWidgetByName('version').getValue();
// var os = this.options.form.getWidgetByName('os').getValue();
// var device = this.options.form.getWidgetByName('device').getValue();
// var desc = this.options.form.getWidgetByName('desc').getValue();
// var today = FR.remoteEvaluate('FORMAT(now(),"yyyy-MM-dd HH:mm:ss")');


FR.ajax({
	url: 'http://192.168.96.37:5001/getInfo',
	type: 'POST',
	// dataType:"jsonp", //跨域采用jsonp方式
	// jsonpCallback:"success_jsonp",
	data: {
		"startDate":"2020-03-01",
		"endDate":"2020-04-14",
		"zsentiment":"",
		"uid":"",
		"game_version":"",
		"device_type":"",
		"desc": '',
		"size":10,
		"from":0
	},
	success:function(json,textStatus,xOptions){
		console.log(json);

		// contentPane.setCellValue("A3", null, json.id);
		// setTimeout($("#fr-btn-FORMSUBMIT1").trigger("click"), 3000);

	},
	error:function(xOptions,textStatus){
		console.log("jsonp.error:"+textStatus+", rel="+xOptions.data.rel);
	}
});