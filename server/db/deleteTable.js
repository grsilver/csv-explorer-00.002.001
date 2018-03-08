const getQueryHandler = require('./getQueryHandler');


module.exports = deleteTable;


function deleteTable(paramObj){
  //paramObj.tblName
  //paramObj.queryHandler
  //paramObj.endConnection // fn
  return new Promise((resolve,reject)=>{

    if(paramObj.queryHandler){
      callSql(paramObj.queryHandler)
    }
    else {
      getQueryHandler().then(callSql).catch(reject)
    }

    function callSql(queryHandler){
      var sql = `DROP TABLE IF EXISTS ${paramObj.tblName};`
      queryHandler(sql).then(function(result){
        if(!paramObj.queryHandler)
          queryHandler.end()
        resolve(result)

      })
      .catch(function(err){
        if(!paramObj.queryHandler)
          queryHandler.end()
        reject(err)
      })
    }

  })
}
