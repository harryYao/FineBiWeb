/**
 * 折线图的提示，自定义显示方式
 */
function() {
  var points = this.points;/*获取当前分类下所有点*/
  var format = function (num) {  
    var reg=/\d{1,3}(?=(\d{3})+$)/g;   
    return (num + '').replace(reg, '$&,');  
  };
  var toPercent = function (point){
    var str=Number(point*100).toFixed(2);
    str+="%";
    return str;
  };
  var showMinutes = function(value) {
    var mimutes = Math.floor(value / 60);
    var seconds = value % 60;
    return mimutes + '分' + seconds + '秒'
  };
  var showMoney = function(num) {
    var reg=/\d{1,3}(?=(\d{3})+$)/g;   
    return '￥' + (num + '').replace(reg, '$&,'); 
  };
  var showLessMoney = function(point) {
    var str=Number(point).toFixed(2);
    return '￥'+str;
  };
  var validPoints = points.filter(function(p) {
    return p.series.visible && p.visible && !p.isNull;/*获取当前分类下的有效点*/
  });
  var percentList = ['付费率'];
  var fixed2List = ['arpu'];
  var lessmoneyList = ['arppu'];
  var moneyList = ['流水', '流水收入', '首充金额'];
  var showTimeList = ['平均在线时长'];
  var htmlstr = '<div>';
  var spanstr1 = '<span style="background-color:';
  var spanstr2 = ';border-radius:50%;width:8px;height:8px;display:inline-block;margin-right:6px;"></span>';
  htmlstr += '<p>' + this.category + '</p>';
  for (let index = 0; index < validPoints.length; index++) {
    var element = validPoints[index];
    var valuestr = '';
    if (percentList.indexOf(element.seriesName) >= 0) {
      valuestr = toPercent(element.value);
    } else if (fixed2List.indexOf(element.seriesName) >= 0) {
      valuestr = element.value.toFixed(2);
    } else if (moneyList.indexOf(element.seriesName) >= 0) {
      valuestr = showMoney(element.value);
    } else if (lessmoneyList.indexOf(element.seriesName) >= 0) {
      valuestr = showLessMoney(element.value);
    } else if (showTimeList.indexOf(element.seriesName) >= 0) {
      valuestr = showMinutes(element.value);
    } else {
      valuestr = format(element.value);
    }
    htmlstr += '<p style="padding-left: 6px;">' + spanstr1 + element.color + spanstr2+ element.seriesName + ': ' + valuestr + '</P>';
  }
  htmlstr += '</div>';
  return htmlstr;
}