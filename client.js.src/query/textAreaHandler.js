
var m = {}
export {m as textAreaHandler};

m.bind2Markup = bind2Markup
m.getValue = getValue
m.setValue = setValue

var _textArea
var _editor

function bind2Markup(pnl){

  _textArea = pnl.querySelector("textarea")


  _editor = CodeMirror.fromTextArea(_textArea, {
  //_editor = window.CodeMirror.fromTextArea(_textArea, {
    mode: "text/x-mssql",
    indentWithTabs: true,
    smartIndent: true,
    lineNumbers: true,
    matchBrackets : true,
    autofocus: true,
    extraKeys: {"Ctrl-Space": "autocomplete"},
    hintOptions: {tables: {
      ssd10: ["vpf", "viewerId", "bufferingtime"],
      countries: ["name", "population", "size"]
    }}
  });

}

function getValue(separator){
  separator = separator || "\n"
  return _editor.getValue()
}
function setValue(v){
  return _editor.setValue(v)
}
