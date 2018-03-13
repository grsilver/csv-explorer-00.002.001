module.exports = {
  version: "00.002.001"
  ,port:8082
  ,database: {
    host: '127.0.0.1'
    ,user: 'root'
    ,password: 'password'
    ,database: 'convivaSSD'
  }
  ,box:{
    clientID: "bl6m53o5y9yjb96i0eo9u614c6b98utq"
    ,clientSecret: "YRMFMgp1ICH5epoc6ePD3mZLqNYHFLSZ"
  }
  ,tblPrimaryKey : "conviva_session_id"
  ,readCsvLine:{
    defaultDirectoryRoot:"./import_cache"
  }
  ,registeredMethods :[
    {requestPath : "file.getLineCount"
      ,filePath:"file/getLineCount.js"
      ,methodName:null
      ,description:"get the total line count of a file"
      ,access : ["tier2"]
      ,params : [
        {name:"filePath",defaultValue:"DailySessionLog_BellMedia_2018-01-17.csv"}
      ]
      ,returnType:"OBJECT"
      ,implemented:"100"
    }
    ,{requestPath : "file.getMainColumnNames"
      ,filePath:"file/getMainColumnNames.js"
      ,methodName:null
      ,description:"TODO: turn into streaming. Won't work on large files. looks at file and sends back MAIN column names."
      ,access : ["tier2"]
      ,params : [
        {name:"filePath",defaultValue:"Book1.csv"}
      ]
      ,returnType:"ROWS"
      ,implemented:"100"
    }
    ,{requestPath : "file.listAllTagNames"
      ,filePath:"file/listAllTagNames.js"
      ,methodName:null
      ,description:`List All Tags in SSD's "column session tags"`
      ,access : ["tier2"]
      ,params : [
        {name:"filePath",defaultValue:"Book1.csv"}
      ]
      ,returnType:"OBJECT"
      ,implemented:"50"
    }
    ,{requestPath : "file.importFileByPath_via_streamChunksAndInsertSql"
      ,filePath:"file/importFileByPath_via_streamChunksAndInsertSql.js"
      ,methodName:null
      ,description:`copies an SSD into a table in streaming chunks`
      ,access : ["tier2"]
      ,params : [
        {name:"tblName",defaultValue:"ssd2"}
        ,{name:"filePath",defaultValue:"DailySessionLog_BellMedia_2018-01-17.csv"}
      ]
      ,returnType:"OBJECT"
      ,implemented:"50"
    }
    ,{requestPath : "file.importFileByPath_via_LoadDataLocalInFile"
      ,filePath:"file/importFileByPath_via_LoadDataLocalInFile.js"
      ,methodName:null
      ,description:`copies an SSD into a table in streaming chunks`
      ,access : ["tier2"]
      ,params : [
        {name:"tblName",defaultValue:"ssd2"}
        ,{name:"filePath",defaultValue:"DailySessionLog_BellMedia_2018-01-17.csv"}
      ]
      ,returnType:"OBJECT"
      ,implemented:"50"
    }
    ,{requestPath : "file.copyPortionSSD2File"
      ,filePath:"file/copyPortionSSD2File.js"
      ,methodName:null
      ,description:`copies a portion of an SSD to another file`
      ,access : ["tier2"]
      ,params : [
        {name:"filePath",defaultValue:"DailySessionLog_BellMedia_2018-01-17.csv"}
        ,{name:"destinationPath",defaultValue:"copy.csv"}
        ,{name:"startLineNum",defaultValue:"0"}
        ,{name:"endLineNum",defaultValue:"10"}
      ]
      ,returnType:"OBJECT"
      ,implemented:"50"
    }
    ,{requestPath : "listMethods"
      ,filePath:"apiMethods/listMethods.js"
      ,methodName: null
      ,description:"description1 description1"
      ,access : ["everyone","tier1","tier2"]
      ,params : [
        {name:"access",defaultValue:"ALL"}
      ]
      ,returnType:"ARRAY"
      ,implemented:"100"
    }
    ,{requestPath : "about"
      ,filePath:"apiMethods/about.js"
      ,methodName:null
      ,description:"description2 description2"
      ,access : ["everyone","tier1","tier2"]
      ,params : [
      ]
      ,returnType:"OBJECT"
      ,implemented:"100"
    }
    ,{requestPath : "getJobInfoByID"
      ,filePath:"lib/jobManager.js"
      ,methodName:"getJobInfoByID"
      ,description:"description2 description2"
      ,access : ["everyone","tier1","tier2"]
      ,params : [
        {name:"jobID",defaultValue:""}
      ]
      ,returnType:"OBJECT"
      ,implemented:"100"
    }
    ,{requestPath : "terminateJobByID"
      ,filePath:"lib/jobManager.js"
      ,methodName:"terminateJobByID"
      ,description:"description2 description2"
      ,access : ["everyone","tier1","tier2"]
      ,params : [
        {name:"jobID",defaultValue:""}
      ]
      ,returnType:"OBJECT"
      ,implemented:"100"
    }
    ,{requestPath : "db.query"
      ,filePath:"db/query.js"
      ,methodName:"query_api"
      ,description:"an open ended query call. Default: list frist 5 rows"
      ,access : ["tier2"]
      ,params : [
        {name:"sql",defaultValue:"SELECT * FROM SSD1 LIMIT 5"}
      ]
      ,returnType:"ROWS"
      ,implemented:"90"
    }
    ,{requestPath : "db.deleteTable"
      ,filePath:"db/deleteTable.js"
      ,methodName:null
      ,description:"deletes a tbl by name"
      ,access : ["tier2"]
      ,params : [
        {name:"tblName",defaultValue:"tblName"}
      ]
      ,returnType:"OBJECT"
      ,implemented:"90"
    }
    ,{requestPath : "db.listTables"
      ,filePath:"db/listTables.js"
      ,methodName:null
      ,description:"List all tables and their size"
      ,access : ["tier2"]
      ,returnType:"ROWS"
      ,implemented:"80"
    }
    ,{requestPath : "box.getOAuthUrl"
      ,filePath:"box/getOAuthUrl.js"
      ,methodName:null
      ,description:"Get The URL for oAuth into Box"
      ,access : ["tier2"]
      ,returnType:"STRING"
      ,implemented:"100"
      ,params : [
        {name:"username",defaultValue:"galen.silvestri@conviva.com"}
      ]
    }
    ,{requestPath : "box.getToken"
      ,filePath:"box/getToken.js"
      ,methodName:null
      ,description:"send authcode get token: {accessToken: 'ACCESS_TOKEN',refreshToken: 'REFRESH_TOKEN',acquiredAtMS: 1464129218402, accessTokenTTLMS: 3600000,}"
      ,access : ["tier2"]
      ,returnType:"STRING"
      ,implemented:"100"
      ,params : [
        {name:"authCode",defaultValue:null}
      ]
    }
    ,{requestPath : "box.checkToken"
      ,filePath:"box/checkToken.js"
      ,methodName:null
      ,description:"check if accesToken works "
      ,access : ["tier2"]
      ,returnType:"STRING"
      ,implemented:"100"
      ,params : [
        {name:"accessToken",defaultValue:null}
      ]
    }
  ]
};
