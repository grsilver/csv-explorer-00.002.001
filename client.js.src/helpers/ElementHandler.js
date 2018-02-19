//ElementHandler
export {ElementHandler as ElementHandler};
ElementHandler.getByID = getById;
ElementHandler
function ElementHandler(element){
  var t = this
  t.parent = parent
  t.element = element

  function parent(){
    return new ElementHandler(element.parentElement);
  }
  function parent(){
    return new ElementHandler(element.parentElement);
  }
  function element(){
    return element
  }

}
function getById(id){
  var e = document.getElementById(id)
  if(!e)return null
  return new ElementHandler(e)

}
function getElementsByClassName(){
  var ary =
}

function
