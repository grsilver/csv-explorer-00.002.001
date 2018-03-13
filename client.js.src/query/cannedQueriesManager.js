import {textAreaHandler as textAreaHandler} from './textAreaHandler.js';

var m = {}
export {m as cannedQueriesManager};
m.bind2Markup = bind2Markup

var _sqlBtnTemplate
var _btnSql_container;

function bind2Markup(pnl){
  _sqlBtnTemplate = pnl.querySelector("*[template=btn]");
  _sqlBtnTemplate.remove();
  _btnSql_container = pnl.querySelector(".query_panel_btnSql_container");

  setBasic()
  setCIRR()
  setRR()
}
function cr8SqlBtn(lbl,sql){
  var btn = _sqlBtnTemplate.cloneNode(true)
  btn.innerHTML = lbl
  _btnSql_container.appendChild(btn)
  btn.addEventListener("click",function(){
    textAreaHandler.setValue(sql)
  });
}
function setBasic(){
  var sql = `
  SELECT * FROM SSD1 LIMIT 5
  `
  cr8SqlBtn("Basic",sql)
}
function setCIRR(){
  var sql = `
  SELECT Interval_cibuffering_time*100/(Interval_buffering_time + Interval_playing_time) as buffering_ratio
  FROM(
    SELECT
      ROUND(SUM(case when a.bufferingtime >30*60*1000  then30*60*1000 else a.bufferingtime -NVL(b.prior_buffering_time_ms,0) end)/60000) AS Interval_buffering_time,
      ROUND(SUM(case when a.cibufferingtime >30*60*1000  then30*60*1000 else a.cibufferingtime -NVL(b.prior_cibuffering_time_ms,0) end)/60000) AS Interval_cibuffering_time,
      ROUND(SUM(a.bufferingtime)/60000) AS life_buff_time ,
      ROUND(SUM(a.playingtime -NVL(b.prior_playing_time_ms,0) )/60000) AS Interval_playing_time
      FROM(
            SELECT playingtime,
                  cibufferingtime,
                  bufferingtime,
                  convivasessionid,
                  startuptimed,
                  starttime,
                  ssd_date
                  FROM CompanyX WHERE ssd_date= 2018-02-20 AND startuptimed!=-1) a
                  LEFT outer JOIN(
                    SELECT r.convivasessionid ASprior_session_id,
                           r.cibufferingtime ASprior_cibuffering_time_ms,
                           r.bufferingtime ASprior_buffering_time_ms,
                           r.playingtime ASprior_playing_time_ms,
                           r.startuptimed asp_startuptimed,
                           r.starttime asp_starttime
                    FROM CompanyX  r
                     WHERE r.ssd_date= 2018-02-19 ) b
                     ON(a.convivasessionid = b.prior_session_id anda.starttime =b.p_starttime)
                     where a.playingtime>0
     ) Tmp
  `
  cr8SqlBtn("CIRR",sql)
}
function setRR(){
  var sql = `
  SELECT  Interval_buffering_time*100/(Interval_buffering_time + Interval_playing_time) as buffering_ratio
  FROM (
    SELECT
      ROUND(SUM(case when a.bufferingtime >30*60*1000  then 30*60*1000 else a.bufferingtime -NVL(b.prior_buffering_time_ms,0) end  )/60000) AS Interval_buffering_time,
      ROUND(SUM(a.bufferingtime)/60000) AS life_buff_time ,
      ROUND(SUM(a.playingtime -NVL(b.prior_playing_time_ms,0) )/60000) AS Interval_playing_time
      FROM (
            SELECT playingtime,
                  bufferingtime,
                  convivasessionid,
                  startuptime,
                  starttime,
                  ssd_date
                  FROM CompanyX WHERE ssd_date = 2018-02-20 AND startuptimed!=-1) a
                  LEFT outer JOIN (
                    SELECT r.convivasessionid AS prior_session_id,
                           r.bufferingtime AS prior_buffering_time_ms,
                           r.playingtime AS prior_playing_time_ms,
                           r.startuptimed as p_startuptimed,
                           r.starttime as p_starttime
                    FROM CompanyX  r
                      WHERE r.ssd_date = 2018-02-19 ) b
                      ON (a.convivasessionid = b.prior_session_id and   a.starttime =b.p_starttime)
       where a.playingtime>0
     ) Tmp
  `
  cr8SqlBtn("RR",sql)
}
