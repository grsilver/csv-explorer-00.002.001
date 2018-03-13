
import {ResponseHandler as ResponseHandler} from './ResponseHandler.js';
import {Display_DataMarkup_Object as Display_DataMarkup_Object} from './Display_DataMarkup_Object.js';
import {Display_DataMarkup_String as Display_DataMarkup_String} from './Display_DataMarkup_String.js';
import {Display_DataMarkup_Table as Display_DataMarkup_Table} from './Display_DataMarkup_Table.js';


export {ResponseHandler_WithDataMarkUps as ResponseHandler_WithDataMarkUps};


class ResponseHandler_WithDataMarkUps extends ResponseHandler{

  constructor(submitHandler) {
    super(submitHandler)
  }

  _displayComplete(){
    super._displayComplete();
    var t = this;

    var container = t.element.querySelector(".response_handler_response_container");
    container.innerHTML = ""

    var returnType = t.submitHandler.methodRegistrationData.returnType
    var response = t.submitHandler.response || t.submitHandler.error
    var display_DataMarkup


    if(t.submitHandler.error){
      display_DataMarkup = new Display_DataMarkup_Object()
    }
    else if(response && returnType =="ROWS" && Array.isArray(response) && typeof response[0]==="object"){
      display_DataMarkup = new Display_DataMarkup_Table()
    }
    else if(typeof response==="object"){
      display_DataMarkup = new Display_DataMarkup_Object()
    }
    else{
      display_DataMarkup = new Display_DataMarkup_String()
    }




    display_DataMarkup
    .aquireMarkup()
    .then(function(){
      container.appendChild(display_DataMarkup.element)
      display_DataMarkup.dataBind(response)
    })
    .catch(function(err){
      throw err
    })

  }

}
