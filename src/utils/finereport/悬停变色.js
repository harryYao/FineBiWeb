setTimeout(function() {
	
	var background_color = "rgb(208, 222, 245)"; //新背景色
	var frozen_back_color = new Array();
	var back_color = new Array();
	var $last_tr;
	var i = 0;
	$(".x-table tr").bind("mouseenter", function () {
	  if (typeof ($last_tr) != "undefined") {
	    if (typeof ($(this).attr("id")) != "undefined") {
	      if (typeof ($("#content-container #frozen-west").attr("id")) != "undefined") {
	        $("#content-container #" + $last_tr.attr("id")).each(function () {
	          $(this).children("td").each(function () {
	            $(this).css("background-color", frozen_back_color[i][$(this).index()]);
	          });
	          i = i + 1;
	        });
	        i = 0;
	      } else {
	        $last_tr.children("td").each(function () {
	          $(this).css("background-color", back_color[$(this).index()]);
	        });
	      }
	      frozen_back_color = [];
	      back_color = [];
	    }
	  }
	  if (typeof ($(this).attr("id")) != "undefined") {
	    if (typeof ($("#content-container #frozen-west").attr("id")) != "undefined") {
	      $("#content-container #" + $(this).attr("id")).each(function () {
	        frozen_back_color[i] = new Array();
	        $(this).children("td").each(function () {
	          frozen_back_color[i][$(this).index()] = $(this).css("background-color");
	          $(this).css("background-color", background_color);
	        });
	        i = i + 1;
	      });
	      i = 0;
	    } else {
	      $(this).children("td").each(function () {
	        back_color[$(this).index()] = $(this).css("background-color");
	        $(this).css("background-color", background_color);
	      });
	    }
	  }
	});
	$(".x-table tr").bind("mouseleave", function () {
	  if (typeof ($(this).attr("id")) != "undefined") {
	    $last_tr = $(this);
	  }
	});
		
}, 500);