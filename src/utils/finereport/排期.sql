

SELECT  coalesce(z.dates,x.pre_dates,y.pre_dates)              as dates
        ,coalesce(z.name,x.name,y.name)                        as name
        ,coalesce(z.pre_chgs,x.pre_chgs,y.pre_chgs)            as pre_chgs
        ,z.chgs
        ,coalesce(z.coins_type,x.coins_type)                   as coins_type
        ,z.cause
        ,coalesce(x.rate,z.rate) as rate
        ,z.result_dates,z.yes_chgs,z.chgs_all
FROM   (
        SELECT  t1.pre_dates,t1.name,t1.coins_type,t1.rate
                ,CASE WHEN t2.name IS NULL and t1.coins_type=10 THEN t1.amount*t1.pre_coefficient
                      WHEN t2.name IS NULL and t1.coins_type=20 THEN t1.amount*t1.pre_coefficient*t1.rate
                      WHEN t2.name IS NOT NULL and t1.coins_type=10 THEN t2.pre_chgs*t1.pre_coefficient
                      ELSE t2.pre_chgs*t1.pre_coefficient*t1.rate
                       END  AS pre_chgs
        FROM   (
                SELECT   case when e.days>datediff(a.dates,b.begin_time)+1  then date_add(b.begin_time,e.days-1) end  as pre_dates
                        ,a.name
                        ,case when e.days>datediff(a.dates,b.begin_time)+1  then e.days end          as pre_days
                        ,case when e.days>datediff(a.dates,b.begin_time)+1  then e.coefficient end   as pre_coefficient
                        ,f.rate 
                        ,b.amount   --活动配置预估金额
                        ,b.coins_type
                  FROM   (
                          SELECT  split(name,'_')[0]  as active_type
                                  ,split(name,'_')[1] as active_name
                                  ,name
                                  ,chgs
                                  ,amounts
                                  ,dates
                           FROM qqdz_report.daily_act_kpi_consume 
                          WHERE dates = '${enddate}'
                          and pay_type = '-1'
                      UNION ALL
                        SELECT  activity_type       as active_type
                                ,activity_id1_name  as active_name
                                ,concat_ws('_',activity_type,activity_id1_name)   as name
                                ,0                  as chgs
                                ,0                  as amounts
                                ,'${enddate}'       as dates
                          FROM  qqdz_report.dim_activity_cfg_infos
                         WHERE  begin_time > '${enddate}'
                        )   a
            LEFT JOIN   (--获取活动金蘑菇、RMB类型，第一天预估金额
                        SELECT  act_id
                                ,activity_type
                                ,activity_id1_name
                                ,coins_type
                                ,amount
                                ,begin_time
                                ,end_time
                          FROM  qqdz_report.dim_activity_cfg_infos
                        )   b
                  ON   a.active_type = b.activity_type
                  AND   a.active_name = b.activity_id1_name
            LEFT JOIN   (
                        SELECT  act_id,days,coefficient
                          FROM  qqdz_report.dim_activity_cfg_coefficient 
                        )   e
                  ON    b.act_id = e.act_id
            LEFT JOIN   (
                        SELECT  rate,dates,cause
                          FROM  qqdz_report.dim_activity_cfg_exchange
                        )  f
                  ON   date_add(b.begin_time,e.days-1) = f.dates
              WHERE   (datediff(a.dates,b.begin_time)<0 OR  e.days>datediff(a.dates,b.begin_time)+1)
                and   date_add(b.begin_time,e.days-1) <= b.end_time
              )    t1
        LEFT JOIN    (--判断是否使用昨日实际金蘑菇进行计算，如为活动开始第一天，采用配置表中预期金额进行计算
                      SELECT   a.dates,a.name
                               ,case when datediff(a.dates,b.begin_time)+1=e.days and e.days=1 then b.amount*e.coefficient  --活动开始第一天
                                     when datediff(a.dates,b.begin_time)+1=e.days and e.days>1 AND b.coins_type=10 then d.amounts*e.coefficient
                                     when datediff(a.dates,b.begin_time)+1=e.days and e.days>1 AND b.coins_type=20 then d.chgs*e.coefficient
                                     end   AS pre_chgs
                        FROM   (
                                SELECT  split(name,'_')[0]  as active_type
                                        ,split(name,'_')[1] as active_name
                                        ,name
                                        ,chgs
                                        ,amounts
                                        ,dates
                                        ,DateFormatConvert(result_dates) AS result_dates
                                        ,from_unixtime(unix_timestamp(DateFormatConvert(result_dates)),'yyyy-MM-dd HH:00:00')  AS result_dates1
                                FROM qqdz_report.daily_act_kpi_consume 
                                WHERE dates between '${startdate}' and '${enddate}'
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
                                SELECT  split(name,'_')[0]  as active_type
                                        ,split(name,'_')[1] as active_name
                                        ,name
                                        ,chgs
                                        ,amounts
                                        ,date_add(dates, 1) as dates
                                FROM  qqdz_report.daily_act_kpi_consume 
                                WHERE dates between Date_sub('${startdate}', 1) and date_add('${enddate}',-1)
                                  and pay_type = '-1'
                              )   d
                              ON  a.name = d.name
                            and  a.dates = d.dates
                  LEFT JOIN   (
                              SELECT  act_id,days,coefficient
                                FROM  qqdz_report.dim_activity_cfg_coefficient 
                              )   e
                        ON    b.act_id = e.act_id
                        and   e.days = datediff(a.dates,b.begin_time)+1
                      WHERE   a.dates = '${enddate}'
                      )    t2
              ON     t1.name = t2.name
           WHERE     CASE WHEN t2.name IS NULL THEN t1.amount*t1.pre_coefficient*t1.rate 
                          ELSE t2.pre_chgs*t1.pre_coefficient*t1.rate
                           END  IS NOT NULL
) x
 FULL OUTER JOIN (
    SELECT   a.dates,a.name,a.chgs,b.coins_type,f.cause, f.rate,a.result_dates,g.chgs as yes_chgs,h.chgs_all
             ,case when datediff(a.dates,b.begin_time)+1=e.days and e.days=1 then b.amount*f.rate  --活动开始第一天
                   when datediff(a.dates,b.begin_time)+1=e.days and e.days>1 then d.chgs*e.coefficient*f.rate
                    end   AS pre_chgs
      FROM   (
              SELECT  split(name,'_')[0]  as active_type
                      ,split(name,'_')[1] as active_name
                      ,name
                      ,chgs
                      ,amount
                      ,dates
                      ,DateFormatConvert(result_dates) AS result_dates
                      ,from_unixtime(unix_timestamp(DateFormatConvert(result_dates)),'yyyy-MM-dd HH:00:00')  AS result_dates1
              FROM qqdz_report.daily_act_kpi_consume 
              WHERE dates between '${startdate}' and '${enddate}'
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
              SELECT  split(name,'_')[0]  as active_type
                      ,split(name,'_')[1] as active_name
                      ,name
                      ,chgs
                      ,amount
                      ,date_add(dates, 1) as dates
              FROM  qqdz_report.daily_act_kpi_consume 
              WHERE dates between Date_sub('${startdate}', 1) and date_add('${enddate}',-1)
                and pay_type = '-1'
            )   d
            ON  a.name = d.name
           and  a.dates = d.dates
LEFT JOIN   (
            SELECT  act_id,days,coefficient
              FROM  qqdz_report.dim_activity_cfg_coefficient 
            )   e
      ON    b.act_id = e.act_id
      and   e.days = datediff(a.dates,b.begin_time)+1
LEFT JOIN   (
            SELECT  rate,dates,cause
              FROM  qqdz_report.dim_activity_cfg_exchange
            )  f
       ON   a.dates = f.dates
LEFT JOIN   (
            SELECT from_unixtime(unix_timestamp(DateFormatConvert(result_dates)),'yyyy-MM-dd HH:00:00')  AS result_dates
                  ,name
                  ,chgs
                  ,amount
              from qqdz_report.daily_act_kpi_consume1
             WHERE dates = DATE_SUB('${enddate}', 1)
               AND pay_type = '-1'
            )  g
       ON   a.result_dates1 = date_add(g.result_dates,1)
      AND   a.name = g.name
LEFT JOIN   (
            SELECT chgs_all,dates
              FROM qqdz_report.mid_consume_all_diamond 
             WHERE dates between '${startdate}' and '${enddate}'
            )  h
       ON   a.dates = h.dates
ORDER BY   a.dates desc
 )  z
ON   cast(x.pre_dates as string) = cast(z.dates as string)
FULL OUTER JOIN (
    SELECT   dates  AS pre_dates,null as name ,null as pre_chgs
      FROM   qqdz_report.dim_activity_cfg_exchange
    WHERE   dates>'${enddate}'
)  y
ON  cast(x.pre_dates as string) = cast(y.pre_dates as string)
ORDER BY   coalesce(z.dates,x.pre_dates,y.pre_dates) DESC


















    SELECT   a.dates,a.name,a.chgs,b.coins_type,f.cause, f.rate,a.result_dates,g.chgs as yes_chgs,h.chgs_all
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
                      ,from_unixtime(unix_timestamp(DateFormatConvert(result_dates)),'yyyy-MM-dd HH:00:00')  AS result_dates1
              FROM qqdz_report.daily_act_kpi_consume 
              WHERE dates between Date_sub('${enddate}', 9) and '${enddate}'
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
              SELECT  split(name,'_')[0]  as active_type
                      ,split(name,'_')[1] as active_name
                      ,name
                      ,chgs
                      ,date_add(dates, 1) as dates
              FROM  qqdz_report.daily_act_kpi_consume 
              WHERE dates between Date_sub('${enddate}', 10) and date_add('${enddate}',-1)
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
LEFT JOIN   (
            SELECT from_unixtime(unix_timestamp(DateFormatConvert(result_dates)),'yyyy-MM-dd HH:00:00')  AS result_dates
                  ,name
                  ,chgs 
              from qqdz_report.daily_act_kpi_consume1
             WHERE dates = DATE_SUB('${enddate}', 1)
               AND pay_type = '-1'
            )  g
       ON   a.result_dates1 = date_add(g.result_dates,1)
      AND   a.name = g.name
LEFT JOIN   (
            SELECT chgs_all,dates
              FROM qqdz_report.mid_consume_all_diamond 
             WHERE dates between Date_sub('${enddate}', 9) and '${enddate}'
            )  h
       ON   a.dates = h.dates
ORDER BY   a.dates desc







