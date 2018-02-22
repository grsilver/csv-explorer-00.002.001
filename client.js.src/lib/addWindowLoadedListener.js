//lib/addWindowLoadedListener.js
export {addWindowLoadedListener as addWindowLoadedListener};
function addWindowLoadedListener(f){
  document.addEventListener("DOMContentLoaded", function(event) {
    f();
  });
}
