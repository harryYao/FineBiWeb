SELECT     COALESCE(t1.name,t2.name)               AS name
          ,COALESCE(t1.coins_type,t2.coins_type)   AS coins_type
          ,COALESCE(t1.days,t2.days)               AS days
          ,t1.chgs                                 AS chgs
          ,t1.amounts                              AS amounts
          ,t1.cause
          ,COALESCE(t1.rate,t2.rate)                AS rate
          ,t1.result_dates
          ,COALESCE(t1.pre_chgs,t2.pre_chgs)        AS pre_chgs
          ,COALESCE(t1.dates,t2.dates)              AS dates
          ,t3.chgs_all
          ,t1.yes_chgs
          ,t1.yes_amounts
          ,COALESCE(t1.coefficient,t2.coefficient,1) as coefficient
  FROM    (--历史活动，计算日为开始第一天的活动
           SELECT    t1.used_name              AS name
                     ,t2.coins_type
                     ,t2.begin_time
                     ,t2.end_time
                     ,t4.days
                     ,t1.chgs*t5.rate/10000    AS chgs
                     ,t1.chgs*t5.rate/10000    AS amounts
                     ,t3.yes_chgs
                     ,t3.yes_amounts
                     ,t5.cause
                     ,t5.rate
                     ,t4.coefficient
                     ,t1.result_dates
                     ,CASE WHEN t4.days>1 THEN t3.chgs*t4.coefficient*t5.rate/10000
                           WHEN t4.days=1 THEN t2.amount*t4.coefficient/10000 
                           WHEN t4.days IS NULL AND t3.chgs IS NOT NULL THEN t3.chgs*t5.rate/10000 
                           WHEN t4.days IS NULL AND t3.chgs IS NULL THEN t1.chgs*t5.rate/10000
                            END   AS pre_chgs
                     ,t1.dates
             FROM    (
                      SELECT   trim(a.name)          AS name
                               ,trim(b.used_name)    AS used_name
                               ,chgs
                               ,amounts
                               ,dates           as dates
                               ,DateFormatConvert(result_dates) AS result_dates
                        FROM   qqdz_report.daily_act_kpi_consume  AS a
                   LEFT JOIN   qqdz_report.dim_activity_name_cfg  AS b
                          ON   trim(a.name) = trim(b.old_name)
                       WHERE   dates BETWEEN '${startdate}' AND date_add('${enddate}',-1)
                         and   pay_type = '-1'
                    )    t1
       LEFT JOIN    (
                     SELECT   act_id
                              ,trim(concat_ws('_',activity_type,activity_id1_name))   as name
                              ,begin_time as begin_time
                              ,end_time   as end_time
                              ,coins_type
                              ,amount
                       FROM   qqdz_report.dim_activity_cfg_infos
                    )    t2
              ON    t1.used_name = t2.name
             AND    t1.dates BETWEEN t2.begin_time AND t2.end_time
       LEFT JOIN    (--昨日实际蘑菇数值
                     SELECT    trim(a.name)         AS name
                               ,trim(c.used_name)   AS used_name
                               ,a.chgs
                               ,a.amounts
                               ,a.chgs*b.rate/10000   AS yes_chgs
                               ,a.chgs*b.rate/10000   AS yes_amounts
                               ,date_add(a.dates, 1)    as dates
                       FROM    qqdz_report.daily_act_kpi_consume a
                 INNER JOIN    qqdz_report.dim_activity_cfg_exchange b
                         ON    a.dates=b.dates
                  LEFT JOIN    qqdz_report.dim_activity_name_cfg  AS c
                         ON    trim(a.name) = trim(c.old_name)
                      WHERE    a.dates BETWEEN date_add('${startdate}',-1) AND date_add('${enddate}',-2)
                        AND    a.pay_type = '-1'
                    )    t3
              ON    t1.used_name = t3.used_name
             and    t1.dates = t3.dates
       LEFT JOIN    (
                    SELECT  act_id,days,coefficient
                      FROM  qqdz_report.dim_activity_cfg_coefficient 
                    )    t4
              ON    t2.act_id = t4.act_id
             AND    datediff(t1.dates,t2.begin_time)+1=t4.days
       LEFT JOIN    (
                    SELECT  rate,dates  AS dates,cause
                      FROM  qqdz_report.dim_activity_cfg_exchange
                    )    t5
              ON    t1.dates = t5.dates
          )    t1
FULL OUTER JOIN    (
          --未来活动，采用配置表中预期金额进行计算,排除衰减系数未配置的未来活动
          SELECT    t1.name
                    ,t1.coins_type
                    ,t1.begin_time
                    ,t2.days
                    ,t3.rate
                    ,t2.coefficient
                    ,t1.amount*t2.coefficient*t3.rate/10000   as pre_chgs
                    ,date_add(t1.begin_time,t2.days-1)        as dates
            FROM    (
                    SELECT   act_id
                             ,trim(concat_ws('_',activity_type,activity_id1_name))   as name
                             ,begin_time as begin_time
                             ,end_time   as end_time
                             ,coins_type
                             ,amount
                             ,'${enddate}'               as dates
                      FROM   qqdz_report.dim_activity_cfg_infos
                     WHERE   begin_time >= '${enddate}'
                     )    t1
           LEFT JOIN    (
                        SELECT  act_id,days,coefficient
                          FROM  qqdz_report.dim_activity_cfg_coefficient 
                        )    t2
                  ON    t1.act_id = t2.act_id
          INNER JOIN    (
                         SELECT   rate,dates  AS dates,cause
                           FROM   qqdz_report.dim_activity_cfg_exchange
                          WHERE   dates <= date_add('${enddate}',15)
                        )    t3
                  ON    date_add(t1.begin_time,t2.days-1) = t3.dates  --关联未来日期金蘑菇兑换比例数值
               WHERE    date_add(t1.begin_time,t2.days-1) IS NOT NULL 
           UNION ALL   --正在进行且未来日期还没结束的活动(未来数据)
              SELECT    t1.name
                        ,t1.coins_type
                        ,t1.begin_time
                        ,t3.days
                        ,t4.rate
                        ,t3.coefficient
                        ,t2.chgs*t3.coefficient*t4.rate/10000      AS pre_chgs
                        ,date_add(t1.begin_time,t3.days-1)         AS dates
                FROM    (
                         SELECT    act_id
                                   ,trim(concat_ws('_',activity_type,activity_id1_name))   AS name
                                   ,begin_time AS begin_time
                                   ,end_time   AS end_time
                                   ,coins_type
                                   ,amount
                                   ,datediff('${enddate}',begin_time)+1  AS days  --活动已开始天数
                                   ,'${enddate}'               AS dates
                           FROM    qqdz_report.dim_activity_cfg_infos
                          WHERE    end_time > '${enddate}'
                            AND    begin_time < '${enddate}'
                         )    t1
           INNER JOIN    (
                          SELECT  trim(a.name)         AS name
                                  ,trim(b.used_name)   AS used_name
                                  ,chgs
                                  ,amounts
                                  ,dates
                            FROM  qqdz_report.daily_act_kpi_consume   AS a
                       LEFT JOIN   qqdz_report.dim_activity_name_cfg  AS b
                              ON   trim(a.name) = trim(b.old_name)
                           WHERE  dates=date_add('${enddate}',-1)
                             AND  pay_type = '-1'
                         )    t2
                   ON    t1.name = t2.used_name
            LEFT JOIN    (
                          SELECT    act_id,days,coefficient
                            FROM    qqdz_report.dim_activity_cfg_coefficient 
                           WHERE    act_id IS NOT NULL
                         )    t3
                   ON    t1.act_id = t3.act_id
                  AND    t1.days <= t3.days
           INNER JOIN    (
                          SELECT   rate,dates  AS dates,cause
                            FROM   qqdz_report.dim_activity_cfg_exchange
                           WHERE   dates <= date_add('${enddate}',15)
                         )    t4
                   ON    date_add(t1.begin_time,t3.days-1) = t4.dates
          )    t2
    ON    t1.name = t2.name
   AND    t1.dates = t2.dates
LEFT JOIN    (
              SELECT    chgs_all,dates  AS dates
                FROM    qqdz_report.mid_consume_all_diamond
               WHERE    dates between '${startdate}' and '${enddate}'
             )    t3
        ON    t1.dates = t3.dates
 ORDER BY    COALESCE(t1.dates,t2.dates)  DESC 


