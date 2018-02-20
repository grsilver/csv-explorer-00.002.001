const _ = require('lodash');
const config = require('../../ssd-explorer.config.js');
const MethodRegistrationHandler = require('./MethodRegistrationHandler.js');

//methodRegistrationManager
var m = module.exports = {}
m.getRegHandlerByPath = getRegHandlerByPath
m.forEachHandler = forEachHandler

var arytHandlers = []

cr8AllHandlers();

function getRegHandlerByPath(path){
  return _.find(arytHandlers,function(handler,i){
    if(handler.requestPath() === path){
      return handler
    }
  })
}

function cr8AllHandlers(){
  console.log("methodRegistrationManager.cr8AllHandlers")
  _.forEach(config.registeredMethods,function(registration){
    var regHandler = new MethodRegistrationHandler(registration)
    arytHandlers.push(regHandler)
  })
}

function forEachHandler(callback){
  _.forEach(arytHandlers,callback)
}
