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
