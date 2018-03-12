
import {ResponseHandler as ResponseHandler} from './ResponseHandler.js';
import {Display_DataMarkup_Object as Display_DataMarkup_Object} from './Display_DataMarkup_Object.js';
import {Display_DataMarkup_String as Display_DataMarkup_String} from './Display_DataMarkup_String.js';
import {Display_DataMarkup_Table as Display_DataMarkup_Table} from './Display_DataMarkup_Table.js';


export {ResponseHandler_WithDataMarkUps as ResponseHandler_WithDataMarkUps};


class ResponseHandler_WithDataMarkUps extends ResponseHandler{

  constructor(submitHandler) {
    super(submitHandler)
  }

}
