SELECT d.`desc`, d.first_uid, d.first_submit_user, d.first_topic, d.first_subtopic, d.first_freq, d.first_topic_index FROM (
        SELECT c.`desc`, first_value(c.uid) OVER (PARTITION BY `desc` ORDER BY c.topic_index) AS first_uid, first_value(c.submit_user) OVER (PARTITION BY `desc` ORDER BY c.topic_index) AS first_submit_user, first_value(c.topic) OVER (PARTITION BY `desc` ORDER BY c.topic_index) AS first_topic, first_value(c.subtopic) OVER (PARTITION BY `desc` ORDER BY c.topic_index) AS first_subtopic, first_value(c.freq) OVER (PARTITION BY `desc` ORDER BY c.topic_index) AS first_freq, first_value(c.topic_index) OVER (PARTITION BY `desc` ORDER BY c.topic_index) AS first_topic_index FROM (
         SELECT a.uid, a.submit_user,
          CASE 
           WHEN a.topic="卡顿" THEN 1
           WHEN a.topic="充值不到账" THEN 2
           WHEN a.topic="挂机" THEN 4
           WHEN a.topic="奖励领取问题" THEN 5
           WHEN a.topic="氪金" THEN 6
           WHEN a.topic="人机问题" THEN 7
           WHEN a.topic="辱骂问题" THEN 8
           WHEN a.topic="闪退" THEN 9
           WHEN a.topic="外挂" THEN 10
           WHEN a.topic="无法充值" THEN 3
           WHEN a.topic="游戏不好玩" THEN 11
          ELSE 12 END AS topic_index,
         a.topic, a.subtopic, a.freq, a.desc, a.type FROM (
          SELECT *, ROW_NUMBER() over (PARTITION BY concat(b.topic, "_", b.subtopic)) as rnum FROM (
           SELECT uid, submit_user, topic, subtopic, freq, desc, type, size(collect_set(descexp)) as entropy FROM qqdz_report.game_feedback_topic_asso_samples LATERAL VIEW explode(split(`desc`, '|')) descexp AS descexp WHERE dates between '${startDate}' AND '${endDate}' AND `desc` NOT rlike "祖坟|你妈|曹尼玛"
           GROUP BY uid, submit_user, topic, subtopic, freq, `desc`, `type`
           ORDER BY entropy desc
          ) b
         ) a
         WHERE a.rnum <= 3
         GROUP BY a.uid, a.submit_user, a.topic, a.subtopic, a.freq, a.`desc`, a.`type`
         ORDER BY topic_index ASC, a.freq DESC
        ) c
       ) d GROUP BY d.`desc`, d.first_uid, d.first_submit_user, d.first_topic, d.first_subtopic, d.first_freq, d.first_topic_index
       ORDER BY d.first_topic_index, d.first_topic, d.first_freq DESC, d.first_subtopic, d.first_uid;