# 配置文件说明

#### notice.json页面通知配置
```
{
 "notices": [
    {
      "title": "通知1",          //标题
      "content": "通知1的内容",  // 内容
      "type": "warning",        //类型： success,info,warning,error
      "duration": 10000,         //持续时间，0：表示不会关闭
      "starttime": "2021-03-03 12:30:00", // 开始时间，未到达则不再显示
      "endtime": "2020-03-03 22:30:00" // 结束时间，超过则不再显示
    },
    {
      "title": "通知",
      "content": "报表服务正在恢复中，请稍后。",
      "type": "warning",
      "duration": 10000,
      "starttime": "2021-03-03 12:30:00",
      "endtime": "2020-03-03 22:30:00"
    }
 ]
}
```

***
