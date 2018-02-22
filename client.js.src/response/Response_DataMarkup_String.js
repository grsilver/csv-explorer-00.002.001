import {DataMarkup as DataMarkup} from '../lib/DataMarkup.js';

export {Response_DataMarkup_String as Response_DataMarkup_String};

class Response_DataMarkup_String extends DataMarkup {

  constructor() {
    super()
    this.includePath = "/includes/response_panel.html"
    this.querySelectorStr = "#response_string"
  }

  onAquireMarkup(ele){
    super.onAquireMarkup(ele)
    this.log("not implemented")
  }

  dataBind (data){
    super.dataBind(data)
    this.log("not implemented")
  }

}
