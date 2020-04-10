    SELECT   a.dates,a.name,a.chgs,b.coins_type,f.cause, f.rate,a.result_dates, e.days, e.coefficient
             ,case when datediff(a.dates,b.begin_time)+1=e.days and e.days=1 then b.amount*f.rate  --活动开始第一天
                   when datediff(a.dates,b.begin_time)+1=e.days and e.days>1 then d.chgs*e.coefficient*f.rate
                    end   AS pre_chgs
      FROM   (
              SELECT  split(name,'_')[0]  as active_type
                      ,split(name,'_')[1] as active_name
                      ,name
                      ,chgs
                      ,dates
                      ,DateFormatConvert(result_dates) AS result_dates
                      
              FROM qqdz_report.daily_act_kpi_consume 
              WHERE dates between Date_sub('${enddate}', 3) and '${enddate}'
              and pay_type = '-1'
            )   a
LEFT JOIN   (--获取活动金蘑菇、RMB类型，第一天预估金额
            SELECT  act_id
                    ,activity_type
                    ,activity_id1_name
                    ,coins_type
                    ,amount
                    ,begin_time
              FROM  qqdz_report.dim_activity_cfg_infos
            )   b
       ON   a.active_type = b.activity_type
      AND   a.active_name = b.activity_id1_name
LEFT JOIN   (--昨日实际蘑菇数值
              SELECT  name
                      ,chgs
                      ,date_add(dates, 1) as dates
              FROM  qqdz_report.daily_act_kpi_consume 
              WHERE dates between Date_sub('${enddate}', 4) and date_add('${enddate}',-1)
                and pay_type = '-1'
            )   d
            ON  a.name = d.name
           and  a.dates = d.dates
LEFT JOIN   (
            SELECT  act_id,days,coefficient
              FROM  dim_activity_cfg_coefficient 
            )   e
      ON    b.act_id = e.act_id
      and   e.days = datediff(a.dates,b.begin_time)+1
LEFT JOIN   (
            SELECT  rate,dates,cause
              FROM  dim_activity_cfg_exchange
            )  f
       ON   a.dates = f.dates
where a.name = '${gamename}'
ORDER BY   a.dates desc