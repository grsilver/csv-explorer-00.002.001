
var m = {};
export {m as queryManager};

m.foreach = foreach

var holder = {

  "count TSN Vidi Web":
      `SELECT COUNT(0)
      FROM SSD1
      WHERE session_tags LIKE '%c3.player.name=TSN+VIDI+Web%'
      AND  starttime >= 1516047600
      AND  starttime < 1516048500
      AND  startuptime = -1;`

  ,"list frist 10 rows":
      `SELECT
      * FROM SSD1
      LIMIT 5`

}
function foreach(func){ //(lbl,query)
  var key;
  for(key in holder){
    func(key,holder[key])
  }
}
