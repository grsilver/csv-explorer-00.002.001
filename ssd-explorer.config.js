module.exports = {
  version: "00.002.001"
  ,database: {
    host: '127.0.0.1'
    ,user: 'root'
    //,password: 'password'
    ,database: 'convivaSSD'
  }
  ,registeredMethods :[
    {
      requestPath : "importSSD.importFile"
      ,filePath:"importSSD/main.js"
      ,methodName:"importFile"
      ,description:"description1 description1"
      ,access : ["tier2"]
      ,params : [
        {name:"param1",defaultValue:"default1"}
        ,{name:"param2",defaultValue:"default2"}
      ]
      ,return:"STRING"
    }
    ,{
      requestPath : "listMethods"
      ,filePath:"listMethods.js"
      ,methodName: null
      ,description:"description1 description1"
      ,access : ["everyone","tier1","tier2"]
      ,params : [
        {name:"param1",defaultValue:"default1"}
        ,{name:"param2",defaultValue:"default2"}
      ]
      ,return:{version:"STRING",rows:"ARRAY"}
    }
    ,{
      requestPath : "about"
      ,filePath:"about.js"
      ,methodName:null
      ,description:"description2 description2"
      ,access : ["everyone","tier1","tier2"]
      ,params : [
        {name:"param1",defaultValue:"default1"}
        ,{name:"param2",defaultValue:"default2"}
      ]
    }
  ]
};
