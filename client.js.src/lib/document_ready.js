//lib/addWindowLoadedListener.js
export {document_ready as document_ready};

function document_ready(){
  return new Promise(function (resolve) {
    if (document.readyState === "complete" || document.readyState ==="interactive") {
      resolve();
    }
    else {
      document.addEventListener("DOMContentLoaded", function(){
        resolve();
      });
    }
  })
}
