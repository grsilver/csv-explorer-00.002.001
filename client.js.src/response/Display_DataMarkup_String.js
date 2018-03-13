import {Display_DataMarkup as Display_DataMarkup} from './Display_DataMarkup.js';


export {Display_DataMarkup_String as Display_DataMarkup_String};

class Display_DataMarkup_String extends Display_DataMarkup {

  constructor() {
    super()
    this.querySelectorStr = ".response_string"
  }

  onAquireMarkup(ele){
    super.onAquireMarkup(ele)
    this.log("not implemented")
  }

  dataBind (data){
    super.dataBind(data);
    var eleVal = this.element.querySelectorAll("*[data=value]")
    eleVal.innerHTML = eleVal
  }

}
