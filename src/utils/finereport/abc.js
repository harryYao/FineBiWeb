	
	/**
	 * 金蘑菇兑换比例配置表，插入行按钮，自动填充时间和比例值
	 */
	
	var num = prompt("请输入插入行数","");
	_g().appendReportRow(this.options.location, this.options.reportIndex,num)
	var location = this.options.location; 
	//获取控件的位置
	var cr = FR.cellStr2ColumnRow(this.options.location);
	//单元格列号
	var col = cr.col;
	//单元格行号
	var ro = cr.row;
	var row = ro + 1; 
	//= parseInt(this.options.location.substr(1));
	var lastdate = contentPane.curLGP.getCellValue("C3").date_milliseconds;
	
	setTimeout(function() {		
		for(var i = 1; i <= num; i++) {
			var da = new Date(lastdate + 1000*60*60*24*i)
			var year = da.getFullYear()+'-';
			var month = da.getMonth()+1+'-';
			var day = da.getDate()+'';
			if (month.length < 3) month = '0' + month;
			if (day.length < 2) day = '0' + day;
			var rq=year+month+day; 
			contentPane.setCellValue("C" + (row + i), null, rq);
			contentPane.setCellValue("D" + (row + i), null, 0.05);
			$("tr[tridx="+ (row + i - 1) +"]").find("td[col="+2+"]").css("background-color","rgb(201, 249, 170)");
			$("tr[tridx="+ (row + i - 1) +"]").find("td[col="+3+"]").css("background-color","rgb(201, 249, 170)");
		}	
	}, 300)


/**
 * 活动系数配置表， 根据天数，自动插入行数
 */
var days = this.options.form.getWidgetByName("days").getValue()
var act_id = this.options.form.getWidgetByName("act_id").getValue()
var startdate = this.options.form.getWidgetByName("startdate").getValue()
if(days > 0) {
	contentPane.appendReportRC(days - 1, "C3")	
	setTimeout(function() {		
		for(var i = 0; i < days; i++) {
			var da = new Date(new Date(startdate).getTime() + 1000*60*60*24*i)
			var year = da.getFullYear()+'-';
			var month = da.getMonth()+1+'-';
			var day = da.getDate()+'';
			if (month.length < 3) month = '0' + month;
			if (day.length < 2) day = '0' + day;
			var rq=year+month+day; 
			contentPane.setCellValue("C" + (3 + i), null, act_id);
			contentPane.setCellValue("D" + (3 + i), null, rq);
			contentPane.setCellValue("E" + (3 + i), null, i + 1);
			contentPane.setCellValue("F" + (3 + i), null, 1 - i * 0.01);
		}	
	}, 300)
}


var startdate = this.options.form.getWidgetByName("startdate");
var yearmonth = this.options.form.getWidgetByName("date");
var day = this.options.form.getWidgetByName("day");
startdate.setValue(new Date(yearmonth.getValue() + "-01"));
var enddate = this.options.form.getWidgetByName("enddate");

var month1stday = this.options.form.getWidgetByName("date").getValue() + "-01";
var ymd = new Date(month1stday);
var thisyear = ymd.getFullYear();
var thismonth = ymd.getMonth();
var nextMonth = ++thismonth;
var nextMonthFirstDay = new Date(thisyear,nextMonth,1);
var oneDay=1000*60*60*24;
var month_last_day = new Date(nextMonthFirstDay-oneDay);

var yy = month_last_day.getFullYear();      //年
var mm = month_last_day.getMonth() + 1;     //月
var dd = month_last_day.getDate();          //日
var mld = yy + "-";
if(mm < 10) mld += "0";
mld += mm + "-";
if(dd < 10) mld += "0";
mld += dd + " ";
var yesday = new Date(new Date().getTime() - oneDay);
if (yesday.getFullYear() == yy && (yesday.getMonth() + 1) == mm) {
	day.setValue(yesday.getDate());
} else {
	day.setValue(dd);
}
enddate.setValue(new Date(mld));





<span>回流用户数</span><span style="display: inline-block;line-height: 14px;color: #999;text-align: center;font-size: 12px;border-radius: 50%;height: 14px;width: 14px;border: 1px solid;transform: scale(0.75);">?</span>
CONCATENATE("<span style='vertical-align: middle;'>"+$$$+"</span><span style='display: inline-block;line-height: 14px;color: #999;text-align: center;font-size: 12px;border-radius: 50%;height: 14px;width: 14px;border: 1px solid;transform: scale(0.75);'>?</span>",(IF(asc == CONCATENATE(CHAR(COL($$$)+64),row($$$)+1), IF(a == 0, "<img style='vertical-align: middle;width:16px;height:16px;margin-left:2px;' src='http://bob.ztgame.com/bi/static/sort_desc.png'/>", "<img style='vertical-align: middle;width:16px;height:16px;margin-left:2px;' src='http://bob.ztgame.com/bi/static/sort_asc.png'/>"), "<img style='vertical-align: middle;width:16px;height:16px;margin-left:2px;' src='http://bob.ztgame.com/bi/static/sort_default.png'/>")))
=IF(asc == CONCATENATE(CHAR(COL($$$)+64),row($$$)+1), IF(a == 0, "<span style='vertical-align: middle;'>"+$$$+"</span><img style='vertical-align: middle;width:16px;height:16px;margin-left:2px;' src='http://bob.ztgame.com/bi/static/sort_desc.png'/>", "<span style='vertical-align: middle;'>"+$$$+"</span><img style='vertical-align: middle;width:16px;height:16px;margin-left:2px;' src='http://bob.ztgame.com/bi/static/sort_asc.png'/>"), "<span style='vertical-align: middle;'>"+$$$+"</span><img style='vertical-align: middle;width:16px;height:16px;margin-left:2px;' src='http://bob.ztgame.com/bi/static/sort_default.png'/>")



setTimeout(function() {
	$("td[id^=E1-]").attr("title","统计日当天活跃，前推30天内未活跃的用户");
	$("td[id^=F1-]").attr("title","上一次活跃日期到统计日当天的时间差在31-60天");
	$("td[id^=G1-]").attr("title","上一次活跃日期到统计日当天的时间差在61-90天");
	$("td[id^=H1-]").attr("title","上一次活跃日期到统计日当天的时间差在91-120天");
	$("td[id^=I1-]").attr("title","上一次活跃日期到统计日当天的时间差在121天以上");
}, 600);
所有回流用户数	月流失回流用户	双月流失回流用户	三月流失回流用户	三月以上流失回流用户
回流用户数	付费用户数	付费渗透率	付费金额（元）	付费用户人均付费金额(元)