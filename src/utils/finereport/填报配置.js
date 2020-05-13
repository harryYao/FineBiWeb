var days = this.options.form.getWidgetByName("days").getValue()
var act_id = this.options.form.getWidgetByName("act_id").getValue()
var startdate = this.options.form.getWidgetByName("startdate").getValue()
var numtype = this.options.form.getWidgetByName("numtype").getValue()
var num = this.options.form.getWidgetByName("num").getValue()

var f1 = contentPane.curLGP.getCellValue('F1');
console.log(f1);
if(days > 0 && f1 > 0) {
  contentPane.appendReportRC(days - f1, "C3");
	setTimeout(function() {		
		for(var i = 1; i <= days - f1; i++) {
			var da = new Date(new Date(startdate).getTime() + 1000*60*60*24*(f1+i-1))
			var year = da.getFullYear()+'-';
			var month = da.getMonth()+1+'-';
			var day = da.getDate()+'';
			if (month.length < 3) month = '0' + month;
			if (day.length < 2) day = '0' + day;
			var rq=year+month+day; 
			contentPane.setCellValue("C" + (3 + i), null, act_id);
			contentPane.setCellValue("D" + (3 + i), null, rq);
      contentPane.setCellValue("E" + (3 + i), null, i + f1);
      if (numtype == 1) {
        contentPane.setCellValue("F" + (3 + i), null, num);
      } else if (numtype == 2) {
        contentPane.setCellValue("F" + (3 + i), null, 1 - (i + f1) * num);
      } else if (numtype == 3) {
        contentPane.setCellValue("F" + (3 + i), null, Math.random() * (2 * num) + (1 - num));
      } 
		}	
	}, 300)
} else if(days > 0 && f1 == 0) {
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
      if (numtype == 1) {
        contentPane.setCellValue("F" + (3 + i), null, num);
      } else if (numtype == 2) {
        contentPane.setCellValue("F" + (3 + i), null, 1 - i * num);
      } else if (numtype == 3) {
        contentPane.setCellValue("F" + (3 + i), null, Math.random() * (2 * num) + (1 - num));
      } 
		}	
	}, 300)
}

var btn0 = this.options.form.getWidgetByName("button0");
btn0.setVisible(false);