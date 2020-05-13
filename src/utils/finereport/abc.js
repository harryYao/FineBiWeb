	
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
