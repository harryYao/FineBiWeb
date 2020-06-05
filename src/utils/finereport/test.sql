IF(DATEDELTA(A2, 0) = TODAY(), 
  CONCATENATE(FORMAT($$$, "#,##0.00"), 
              IF(LEN(Q2) = 0, 
                "", 
                CONCATENATE( " <span style=\"color:", IF(P2 > Q2, "green", "red") ,";\">", FORMAT((P2 - Q2) / Q2 * 100, 0.00), "%</span>"))
             ), 
  IF(DATEDELTA(A2, 1) = TODAY() || DATEDELTA(A2, 0) = TODAY(), 
    CONCATENATE(FORMAT($$$, "#,##0.00"),  
            IF(LEN(P2[A2:+1]) = 0, 
            "", 
            CONCATENATE(" <span style=\"color:", IF(P2 > P2[A2:+1], "green", "red") ,";\">", FORMAT((P2 - P2[A2:+1]) / P2[A2:+1] * 100, 0.00), "%</span>")) 
      ), FORMAT($$$, "#,##0.00")
    )
  )




select t1.dates,t1.active_type,t1.active_sub_id,t1.active_sub_name,t1.chgs
      ,t1.coins_type,t1.act_id,t1.activity_type_id,t1.activity_id1
      ,t1.activity_type,t1.activity_id1_name,t1.amount
      ,t1.days,t2.coefficient
      ,case when t1.coins_type = 10 then t1.chgs*t2.coefficient 
            when t1.coins_type = 20 then t1.chgs*t2.coefficient*t3.rate 
            end 
from (
      select   a.active_type,a.active_sub_id,a.active_sub_name,a.chgs
              ,b.coins_type,b.act_id,b.activity_type_id,b.activity_id1
              ,b.activity_type,b.activity_id1_name,b.amount
              ,datediff(a.dates,b.begin_time)+1 as days
              ,a.dates
          from mid_activity_type_consume as a
      left join dim_activity_cfg_infos as b
              on a.active_type = b.activity_type
              and a.active_sub_id = b.activity_id1
      where a.dates between "${startdate}" and "${enddate}" 
        and a.active_type != '-1'
        and a.player_type = '-1' 
        and a.plat_id = -1 and game_id = 1
)  t1
left join (
select  act_id,days,coefficient
  from  dim_activity_cfg_coefficient 
)  t2
on t1.act_id = t2.act_id
and t1.days = t2.days
left join (
select  rate,dates
  from  dim_activity_cfg_exchange
)  t3
on t1.dates = t3.dates








SELECT result_dates,pay_type,level_id, lattice_id,types, sum(num1) AS num1,sum(num2) AS num2,sum(num3) AS num3,sum(num4) AS num4, 
sum(num5) AS num5,sum(num6) AS num6,sum(num7) AS num7,sum(num8) AS num8
 FROM 
(
     SELECT result_dates,pay_type,level_id ,lattice_id,types, 0 AS num1,0 AS num2, 0 AS num3,0 AS num4 , num AS num5, 0 AS num6,0 AS num7, 0 as num8
FROM qqdz_report.pyramid_key_prop_level_add WHERE  prop_id='141203'  AND game_id=1 
  UNION ALL
     SELECT result_dates,pay_type,level_id ,lattice_id,types, 0 AS num1,0 AS num2, 0 AS num3,0 AS num4 , 0 AS num5, num AS num6,0 AS num7, 0 as num8
FROM qqdz_report.pyramid_key_prop_level_add WHERE  prop_id='141204'  AND game_id=1 
  UNION ALL
     SELECT result_dates,pay_type,level_id ,lattice_id,types, 0 AS num1,0 AS num2, 0 AS num3,0 AS num4 , 0 AS num5, 0 AS num6,num AS num7, 0 as num8
FROM qqdz_report.pyramid_key_prop_level_add WHERE  prop_id='141205'  AND game_id=1 
  UNION ALL
   SELECT result_dates,pay_type,level_id ,lattice_id,types, 0 AS num1,0 AS num2, 0 AS num3,0 AS num4 , 0 AS num5, 0 AS num6,0 AS num7, num as num8
FROM qqdz_report.pyramid_key_prop_level_add WHERE  prop_id='141206'  AND game_id=1 
  UNION ALL
  SELECT result_dates,pay_type,level_id ,lattice_id,types,num AS num1,0 AS num2, 0 AS num3,0 AS num4 , 0 AS num5, 0 AS num6,0 AS num7, 0 as num8
FROM qqdz_report.pyramid_key_prop_level_add WHERE  prop_id='141176'  AND game_id=1  
  UNION ALL 
SELECT result_dates,pay_type,level_id, lattice_id,types,0 AS num1,num AS num2, 0 AS num3,0 AS num4 , 0 AS num5, 0 AS num6,0 AS num7, 0 as num8
FROM qqdz_report.pyramid_key_prop_level_add WHERE  prop_id='141186'  AND game_id=1  
    UNION ALL 
SELECT result_dates,pay_type,level_id ,lattice_id,types,0 AS num1,0 AS num2, num AS num3,0 AS num4 , 0 AS num5, 0 AS num6,0 AS num7, 0 as num8
FROM qqdz_report.pyramid_key_prop_level_add WHERE  prop_id='141174'  AND game_id=1 
    UNION ALL 
SELECT result_dates,pay_type,level_id ,lattice_id,types,0 AS num1,0 AS num2, 0 AS num3,num AS num4, 0 AS num5, 0 AS num6,0 AS num7, 0 as num8
 FROM qqdz_report.pyramid_key_prop_level_add WHERE
  prop_id='141172'  AND game_id=1 
)t WHERE  t.result_dates BETWEEN '${pyramid_key_prop_level_add_start_date}'
 and '${pyramid_key_prop_level_add_end_date}' and  t.pay_type in( '${pyramid_key_prop_level_add_pay_type}') 
 and lattice_id in ('${pyramid_key_prop_level_add_lattice_id}')
 and types in ('${pyramid_key_prop_level_add_types}')
 GROUP BY result_dates,pay_type,level_id,lattice_id ,types
order by result_dates desc, lattice_id 




SELECT result_dates,pay_type,level_id, lattice_id,types, sum(num1) AS num1,sum(num2) AS num2,sum(num3) AS num3,sum(num4) AS num4 FROM 
(SELECT result_dates,pay_type,level_id ,lattice_id,types,num AS num1,0 AS num2, 0 AS num3,0 AS num4 FROM qqdz_report.pyramid_key_prop_level_add WHERE  prop_id='141176'  AND game_id=1  
  UNION ALL 
SELECT result_dates,pay_type,level_id, lattice_id,types,0 AS num1,num AS num2, 0 AS num3,0 AS num4 FROM qqdz_report.pyramid_key_prop_level_add WHERE  prop_id='141186'  AND game_id=1  
    UNION ALL 
SELECT result_dates,pay_type,level_id ,lattice_id,types,0 AS num1,0 AS num2, num AS num3,0 AS num4 FROM qqdz_report.pyramid_key_prop_level_add WHERE  prop_id='141174'  AND game_id=1 
    UNION ALL 
SELECT result_dates,pay_type,level_id ,lattice_id,types,0 AS num1,0 AS num2, 0 AS num3,num AS num4 FROM qqdz_report.pyramid_key_prop_level_add WHERE
  prop_id='141172'  AND game_id=1 
)t WHERE  t.result_dates BETWEEN '${pyramid_key_prop_level_add_start_date}'
 and '${pyramid_key_prop_level_add_end_date}' and  t.pay_type in( '${pyramid_key_prop_level_add_pay_type}') 
 and lattice_id in ('${pyramid_key_prop_level_add_lattice_id}')
 and types in ('${pyramid_key_prop_level_add_types}')
 GROUP BY result_dates,pay_type,level_id,lattice_id ,types
order by result_dates desc, lattice_id 

