export {EventListenerManager as EventListenerManager};
function EventListenerManager(scope){

  var t = this;
  t.registerEvent = registerEvent
  t.setMethodAssignmentScope = setMethodAssignmentScope

  var scope = t
  var eventRegistrations = []
  var methodAssignmentScope = t

  function setMethodAssignmentScope(s){
    methodAssignmentScope = s
    return t;
  }
  function registerEvent(eventName){
    var eventRegistration = {
      name:eventName,
      listenerRegistrations : []
    }
    eventRegistrations.push(eventRegistration)
    function add(listener){
      if(typeof (listener)!= "function"){
        throw "add"+eventName + "Listener() is not a function: "+ listener
        //throw new TypeError([message[, fileName[, lineNumber]]])
      }
      var listenerRegistration = {
        listener:listener
      }
      listenerRegistration.remove = function(){
        remove(listener)
      }
      eventRegistration.listenerRegistrations.push(listenerRegistration)
      return listenerRegistration
    }
    function remove(listener){
      var oldAry = eventRegistration.listenerRegistrations
      var newAry = []
      var listenerRegistration
      for(var i=0;i<oldAry.length;i++){
        listenerRegistration = oldAry[i]
        if(listenerRegistration.listener!=listener){
          newAry.push(listenerRegistration)
        }
      }
      eventRegistration.listenerRegistrations = newAry
    }
    function broadcast(evt){
      if(!evt)
        evt = eventName

      if(typeof (evt) === 'string'){
        evt = {name:evt}
      }
      if(!evt.name){
        evt.name = eventName
      }
      var oldAry = eventRegistration.listenerRegistrations
      var lastListenerReg
      var boolStop = false
      alertListener(0)
      function alertListener(i){
        var listenerRegistration = eventRegistration.listenerRegistrations[i]
        if( listenerRegistration == null)
          return
        if (listenerRegistration == lastListenerReg)
          return
        if(boolStop)
          return

        var options = {
          stopBroadcast : function(){
            boolStop = true
          }
          ,remove : function(){
            listenerRegistration.remove()
          }
        }
        listenerRegistration.listener(evt,scope,options)
        alertListener(0+1)
      }

    }
    methodAssignmentScope["add"+eventName + "Listener"] = add
    methodAssignmentScope["remove"+eventName + "Listener"] = remove
    methodAssignmentScope["broadcast"+eventName ] = broadcast
    return t;
  }
}
