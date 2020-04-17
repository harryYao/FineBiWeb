var rq_user = '${=fr_username}';
var startDate = this.options.form.getWidgetByName('startDate').getValue();
var endDate = this.options.form.getWidgetByName('endDate').getValue();

var feedtype = this.options.form.getWidgetByName('feedtype').getValue();
var uid = this.options.form.getWidgetByName('uid').getValue();
var version = this.options.form.getWidgetByName('version').getValue();
var os = this.options.form.getWidgetByName('os').getValue();
var url = this.options.form.getWidgetByName('url').getValue();
var desc = this.options.form.getWidgetByName('desc').getValue();
var today = FR.remoteEvaluate('FORMAT(now(),"yyyy-MM-dd HH:mm:ss")');
if (url) {
  url = 'http://' + url + ':5001/getInfo'
} else {
 url = 'http://bob-bi-api.ztgame.com:5001/getInfo'
}
console.log(startDate, endDate, uid, version, os, desc)
FR.ajax({
	url: url,
	// url: 'http://bob-bi-api.ztgame.com:5001/getInfo',
	// url: 'http://192.168.96.37:5001/getInfo',
	type: 'POST',
	dataType: 'json', 
	// contentType: 'application/json',
	data: {
		"startDate": startDate,
		"endDate": endDate,
		"zsentiment": "",
		"uid": uid,
		"game_version": version,
		"device_type": os,
		"desc": desc,
		"size": 30,
		"from": 0
	},
	success:function(data, textStatus, xOptions){
		if (data && data.length > 0) {
			for (let i = 0; i < data.length; i++) {
				const element = data[i];
				contentPane.setCellValue("A" + (3 + i), null, element.zsentiment);
				contentPane.setCellValue("B" + (3 + i), null, element.uid);
				contentPane.setCellValue("C" + (3 + i), null, element.submit_user);
				contentPane.setCellValue("D" + (3 + i), null, element.desc);
				contentPane.setCellValue("E" + (3 + i), null, element.contact);
				contentPane.setCellValue("F" + (3 + i), null, element.system_type);
				contentPane.setCellValue("G" + (3 + i), null, element.game_version);
				contentPane.setCellValue("H" + (3 + i), null, element.device_type);
				contentPane.setCellValue("I" + (3 + i), null, element.zsentiment);
				contentPane.setCellValue("J" + (3 + i), null, element.location);
			}
		}
		// setTimeout($("#fr-btn-FORMSUBMIT1").trigger("click"), 3000);
	},
	error:function(xOptions,textStatus){
		console.log(textStatus, xOptions.responseText);
	}
});