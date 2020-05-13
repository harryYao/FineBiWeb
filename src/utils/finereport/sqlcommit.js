
var test = this.options.form.getWidgetByName('formSubmit0')
test.setEnable(false)
$("#fr-btn-FORMSUBMIT0").text("提交中....")


function retime(){
	$("#fr-btn-FORMSUBMIT2").trigger("click");
	var err_state =  $('td[id^=D2-]').text(); //获取E3单元格的值

	if(err_state == 'OK'){
		clearInterval(dingtime);
		test.setEnable(true);
		$("td[id^='H']").show();
		console.log('取消定时器');
		$("#fr-btn-FORMSUBMIT0").text("提交");
	}
	if(err_state.indexOf("error") >= 0 ) {
    	clearInterval(dingtime);
    	test.setEnable(true);
    	$("#fr-btn-FORMSUBMIT0").text("提交")
	}
}

var dingtime
var rq_user = '${=fr_username}';
var sql_select = this.options.form.getWidgetByName('textArea0').getValue();
var id_Data = this.options.form.getWidgetByName('id');

if (sql_select === "") {
	window.alert("请输入sql语句");
	return false;
}
//window.alert(sql_select)

var rq_url = "http://115.159.248.97:8080/pullDataWriteSql" + "?user_name=" + rq_user + "&writeSql=" + Base64.encode(sql_select);
console.log(rq_url);


FR.ajax({ 
	url: rq_url,
	dataType:"jsonp", //跨域采用jsonp方式
	jsonpCallback:"success_jsonp",
	success:function(json,textStatus,xOptions){  
		id_Data.setValue(json.id); 
		_g().parameterCommit(); 
		$("#fr-btn-FORMSUBMIT2").trigger("click");
		dingtime = setInterval(retime, 1000*6)
	},  
	error:function(xOptions,textStatus){  
		console.log("jsonp.error:"+textStatus+", rel="+xOptions.data.rel);  
	}  
});

alert("提交成功,日志打包中,请稍等.......");
return false;
