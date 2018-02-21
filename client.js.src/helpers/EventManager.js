export {EventManager as EventManager};
function EventManager(scope){

  var t = this;
  t.registerEvent = registerEvent
  t.add = t.addListener = {}
  t.cast = t.broadcast = {}
  t.rmv = t.removeListener = {}
  t.br = t.break = {}
  t.eventRegistrations = []

  var scope = t
  var eventRegistrations = t.eventRegistrations



  function registerEvent(eventName){ //listener(evt,scope,listenerReg)listenerReg.break. listenerReg.break listenerReg.eventManager
    var eventRegistration = {
      name:eventName
      ,listenerRegistrations : []
      ,breakRequested : false
    }
    eventRegistrations.push(eventRegistration)
    function add(listener){
      if(typeof (listener)!= "function"){
        throw new Error ("addListener."+eventName+"() listener is not a function: "+ listener)
      }
      var listenerRegistration = {
        listener:listener
      }
      listenerRegistration.remove = function(){
        remove(listener)
      }
      listenerRegistration.break = breakCast
      listenerRegistration.eventManager = t;
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
      eventRegistration.breakRequested = false
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
      alertListener(0)
      function alertListener(i){
        var listenerRegistration = eventRegistration.listenerRegistrations[i]
        if( listenerRegistration == null)
          return
        if (listenerRegistration == lastListenerReg)
          return
        if(eventRegistration.breakRequested)
          return

        listenerRegistration.listener(evt,scope,listenerRegistration)
        alertListener(0+1)
      }

    }
    function breakCast(){
      eventRegistration.breakRequested = true
    }
    t.addListener[eventName] = add
    t.broadcast[eventName] =  broadcast
    t.removeListener[eventName] =  remove
    t.break[eventName] =  breakCast
    return t;
  }
}
