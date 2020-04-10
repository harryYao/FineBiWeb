setTimeout(function () {
  var b =document.title;
  var a =BI.designConfigure.reportId;//获取模板id
  //对模板id进行判断，实现指定模板刷新
  if (a=="4e152a061f894c20937d385efa47b8fa") {
   setInterval(function () {
    BI.SharingPool.put("controlFilters", BI.Utils.getControlCalculations());
    //Data.SharingPool.put("controlFilters", BI.Utils.getControlCalculations());
    BI.Utils.broadcastAllWidgets2Refresh(true);
   }, 3000);//3000为定时刷新的频率，单位ms
  }
 }, 2000);