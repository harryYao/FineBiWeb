	
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
