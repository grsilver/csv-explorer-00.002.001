// cr8TableForSSDImport
const forEach = require ('../lib/forEach.js');
const config = require('../../ssd-explorer.config.js');
const getMainColumnNames = require('./getMainColumnNames.js');
//const knex =  require('knex');
//const mariasql =  require('mariasql');
const query =  require('../query/query.js');
const listSizesOfTables =  require('../query/listSizesOfTables.js');

module.exports = importSSD;

function importSSD(paramObj,resolve,reject){
  //paramObj.tblName
  //paramObj.filePath
  var tblName = paramObj.tblName
  var filePath = paramObj.filePath

  promiseWrap(listSizesOfTables,paramObj)
  .then(function(aryTables){

  })
  .catch(function(err){
    reject(err)
  })
  listSizesOfTables(paramObj
    ,function(aryTables){//listSizesOfTables success

      else{
        getMainColumnNames(paramObj
          ,function(fieldObjArray){ //getMainColumnNames success
            cr8Tbl(paramObj.tblName,fieldObjArray,resolve,reject)
          }
          ,function(err){//getMainColumnNames fail
            reject(err)
          }
        )
      }
    }
    ,function(err){//listSizesOfTables error
      reject(err);
    }
  )
}

function tblExisits(tblName,aryTables){
  return forEach(aryTables,function(obj,count,fnBreak){
    if(obj.Table == tblName)
      return fnBreak(true)
  })
}



function cr8Tbl(tblName,fieldObjArray,resolve,reject){
  //fieldObjArray = [{csv_col_name:"",db_friendly_field_name:"",proposedFieldType:""}]
  /* from Jose
  {
    planned_db_field_name:"viewerId"
    ,planned_db_type:"VARCHAR(255)"
    ,ssd_col_name:"﻿viewerId"
  }
  ,{
    planned_db_field_name:"asset"
    ,planned_db_type:"VARCHAR(255)"
    ,ssd_col_name:"asset"
  }
  ,{
    planned_db_field_name:"device_os"
    , planned_db_type:"VARCHAR(255)"
    ,ssd_col_name:"device/os"
  }
  ,{
    planned_db_field_name:"country"
    ,planned_db_type:"int(8)"
    ,ssd_col_name:"country"
  }
  ,{
    planned_db_field_name:"state"
    ,planned_db_type:"VARCHAR(255)"
    ,ssd_col_name:"state"
  }
  ,{
    planned_db_field_name:"city"
    ,planned_db_type:"VARCHAR(255)"
    ,ssd_col_name:"city"6
  :
    planned_db_field_name:"asn"
    ,planned_db_type:"int(11)"
    ,ssd_col_name:"asn"7
  :
    planned_db_field_name:"isp"
    ,planned_db_type:"VARCHAR(255)"
    ,ssd_col_name:"isp"8
  :
    planned_db_field_name:"start_time_unix_time"
    ,planned_db_type:"int(8)"
    ,ssd_col_name:"start time (unix time)"
  {
  ,{
    planned_db_field_name:"startup_time_ms"
    ,planned_db_type:"int(8)"
    ,ssd_col_name:"startup time (ms)"
  {
  ,{
    planned_db_field_name:"playing_time_ms"
    ,planned_db_type:"int(8)"
    ,ssd_col_name:"playing time (ms)"
  }
  ,{
    ,planned_db_field_name: "buffering_time_ms"
    ,planned_db_type: "int(8)"
    ,ssd_col_name: "buffering time (ms)"
  }
  ,{
    planned_db_field_name:"interrupts"
    ,planned_db_type:"int(8)"
    ,ssd_col_name:"interrupts"
  {
  ,{
    planned_db_field_name:"average_bitrate_kbps"
    ,planned_db_type:"int(8)"
    ,ssd_col_name:"average bitrate (kbps)"
  {
  ,{
    planned_db_field_name:"startup_error"
    ,planned_db_type:"int(8)"
    ,ssd_col_name:"startup error"
  {
  ,{
    planned_db_field_name:"session_tags"
    ,planned_db_type:"VARCHAR(2083)"
    ,ssd_col_name:"session tags"
  {
  ,{
    planned_db_field_name:"ip_address"
    ,planned_db_type:"VARCHAR(255)"
    ,ssd_col_name:"ip address"
  {
  ,{
    planned_db_field_name:"cdn"
    ,planned_db_type:"VARCHAR(255)"
    ,ssd_col_name:"cdn"
  {
  ,{
    planned_db_field_name:"browser"
    ,planned_db_type:"VARCHAR(255)"
    ,ssd_col_name:"browser"
  {
  ,{
    planned_db_field_name:"conviva_session_id"
    ,planned_db_type:"VARCHAR(255)"
    ,ssd_col_name:"conviva session id"
  {
  ,{
    planned_db_field_name:"stream_url"
    ,planned_db_type:"VARCHAR(255)"
    ,ssd_col_name:"stream url"
  {
  ,{
    planned_db_field_name:"error_list"
    ,planned_db_type:"VARCHAR(255)"
    ,ssd_col_name:"error list"
  {
  ,{
    planned_db_field_name:"percentage_complete"
    ,planned_db_type:"int(8)"
    ,ssd_col_name:"percentage complete"
  }

  */
  //https://dev.mysql.com/doc/refman/5.5/en/creating-tables.html
  //CREATE TABLE pet (name VARCHAR(20), owner VARCHAR(20),


    //context.db.query(`CREATE TABLE IF NOT EXISTS ${tblnm} ( ${fields} )`,

    var sql = `CREATE TABLE ${tblName}
    (`
      forEach(fieldObjArray,function(fieldObj,count){
        var field_name = fieldObj.db_friendly_field_name
        var db_type = fieldObj.proposedFieldType
        //(name VARCHAR(20), owner VARCHAR(20)
        if(count >0)
          sql+= ","
        sql+= field_name + " " + db_type
      })

    sql+=`
    )`;

    //return resolve({sql:sql})


    query.singleQueryPromise(sql)
        .then(function(rows){
          resolve(rows)
        })
        .catch(function(err){
          reject(err)
        })
}

/*
function useKnex(){
  knex({
    client: 'mysql',
    connection: {
      host : config.database.host,
      user : config.database.user,
      //password : 'your_database_password',
      database : config.database.database
    }
  });
  //http://knexjs.org/#Schema-Building
  return knex.schema.createTable('users', function (table) {
    table.string('conviva_session_id');
    foreach(fieldObjArray,function(fieldObj){
      var field_name = fieldObj.planned_db_field_name
      var db_type = fieldObj.planned_db_type
      if(field_name=="conviva_session_id")
        return
      if(db_type."int(8)"){
        table.integer(field_name)
      }
    })
    callback(true)
  })
}
*/
