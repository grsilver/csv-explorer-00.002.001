import {document_ready as document_ready} from './document_ready.js';
export {findElementOrLoadInclude as findElementOrLoadInclude};


function findElementOrLoadInclude(querySelector,includePath,scope){
  scope = scope || document
  var ele
  var url = includePath
  return new Promise(function (resolve, reject) {
    document_ready(function(){
      ele = scope.querySelector(querySelector);
      if(ele){
        console.log("findElementOrLoadInclude D")
        resolve(ele)
      }
      else{
        loadFile(url)
        .then(function(htmlString){
          var doc
          try{
            //https://davidwalsh.name/convert-html-stings-dom-nodes
            //createRange().createContextualFragment
            var  parser = new DOMParser()

            doc = parser.parseFromString(htmlString, "text/html");
          }
          catch(err){
            reject({
              message: `didn't find (${querySelector}), loaded: ${url} but can't parse`
              ,innerError:err
            })
            return
          }
          var ele = doc.querySelector(querySelector);
          if(ele){
            resolve(ele)
          }
          else{
            reject({
              message: `didn't find (${querySelector}), loaded: ${url}, parsed, but query failed.`
              ,innerError:err
            })
          }
        })
        .catch(function(err){
          reject({
            message: `can't find element via querySelector (${querySelector}) and can't load url: ${url}`
            ,xhrError:err
          })
        })
      }
    })
  })
}
function loadFile(url){
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.responseText)
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        message:"xhr (status < 200 || status > 300) ",
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send();
  });
}
