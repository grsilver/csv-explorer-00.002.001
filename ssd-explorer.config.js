module.exports = {
  version: "00.002.001"
  ,registeredMethods :[
    {
      requestPath : "importSSD.importFile"
      ,filePath:"importSSD/main.js"
      ,methodName:"importFile"
      ,description:"description1 description1"
      ,access : {}
      ,params : [
        {name:"param1",defaultValue:"default1"}
        ,{name:"param2",defaultValue:"default2"}
      ]
    }
    ,{
      requestPath : "listMethods"
      ,filePath:"listMethods.js"
      ,methodName: null
      ,description:"description1 description1"
      ,access : {}
      ,params : [
        {name:"param1",defaultValue:"default1"}
        ,{name:"param2",defaultValue:"default2"}
      ]
    }
    ,{
      requestPath : "about"
      ,filePath:"about.js"
      ,methodName:null
      ,description:"description2 description2"
      ,access : {}
      ,params : [
        {name:"param1",defaultValue:"default1"}
        ,{name:"param2",defaultValue:"default2"}
      ]
    }
  ]
};
