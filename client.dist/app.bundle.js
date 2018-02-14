/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return m; });
var m = {};


//https://github.com/github/fetch

m.query = query;
m.about = about;
m.call = call;
var sessionToken = "dsafkjhdk;afjhd;akfjhew" // todo


function query(sql,callback){
  call('query.call',{sql:sql},callback)
}
function about(paramObj,callback){
  call('about.all',paramObj,callback)
}
function call(methodPath,methodParam,callback){
  if (typeof methodParam == 'object') methodParam = JSON.stringify(methodParam)

  var data = {
    version:"ver.00.00.001",
    methodPath: methodPath,
    methodParam:methodParam,
    sessionToken:sessionToken
  }
  post("/api",data,callback)
}
function post(url,data,callback){
  data = data || {}
  var strEncodedData = encodeData(data)
  console.log(`sending: ${url} : \ndata: ${JSON.stringify(data)} \n encoded:${strEncodedData} `)

  var req = new XMLHttpRequest();
  req.open('POST', url);
  req.onreadystatechange = function() {
      if (req.readyState>3 && req.status==200){
        try{
          var objResp = JSON.parse(req.responseText)
          callback(true, objResp)
        }catch(e){
          callback(false, {msg:"bad JSON",responseText:req.responseText, innerError:e})
        }
      }
      if (req.readyState>3 && req.status!=200){
        callback(false, {msg:"req.status!=200"})
      }
  };
  req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  req.send(strEncodedData);
  return req;
}
function encodeData(data){
  return typeof data == 'string' ? data : Object.keys(data).map(
            function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
  ).join('&');
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__submitHandler_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__boxHandler_js__ = __webpack_require__(5);


// DOCS="/Users/gsilvestri/Google Drive/dev/SSDQuery/client"
// cd "$DOCS"
// npm run build

//console.log("index.js: "+ comp1)
console.log("index.js");
__WEBPACK_IMPORTED_MODULE_0__submitHandler_js__["a" /* submitHandler */].init();
__WEBPACK_IMPORTED_MODULE_1__boxHandler_js__["a" /* boxHandler */].init();


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return m; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__apiHandler_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__displayResponseRows_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__queryManager_js__ = __webpack_require__(4);



__WEBPACK_IMPORTED_MODULE_2__queryManager_js__["a" /* queryManager */]

var m = {};


//https://github.com/github/fetch
var btn_template
m.init = function(){
  console.log('submitHandler.init()2');
  onWindowLoad(function(){
    //document.getElementById("btn_query").addEventListener("click", query);
    document.getElementById("btn_about").addEventListener("click", about);
    setPredefinedQueries();
  })
}

function setPredefinedQueries(){
  btn_template = document.getElementById("btn_template")
  var parentNode = btn_template.parentNode;
  parentNode.removeChild(btn_template);
  var btn
  __WEBPACK_IMPORTED_MODULE_2__queryManager_js__["a" /* queryManager */].foreach(function(lbl,queryStr){
    btn = btn_template.cloneNode(true)
    parentNode.appendChild(btn);
    btn.innerHTML = lbl
    btn.addEventListener("click", function(){
      query(queryStr)
    });
  })
}

function query(queryStr){
  document.getElementById("input1").value = queryStr
  __WEBPACK_IMPORTED_MODULE_0__apiHandler_js__["a" /* apiHandler */].query(queryStr,function(success, objResp){
    if( success ){
      //console.log("query success: "+ JSON.stringify(objResp))
      __WEBPACK_IMPORTED_MODULE_1__displayResponseRows_js__["a" /* displayResponseRows */].display(objResp.apiResponse.rows)
    }
    else{
      console.log("query error: "+ JSON.stringify(objResp))
    }
  })
}
function about(){
  var miscParams = {a:1,b:2}
  __WEBPACK_IMPORTED_MODULE_0__apiHandler_js__["a" /* apiHandler */].about(miscParams,function(success, objResp){
    if( success ){
      console.log("about success: "+ JSON.stringify(objResp))
    }
    else{
      console.log("about error: "+ JSON.stringify(objResp))
    }
  })
}
function onWindowLoad(f){
  document.addEventListener("DOMContentLoaded", function(event) {
    f();
  });
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return m; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__apiHandler_js__ = __webpack_require__(0);


var m = {};
m.display = display;



var thead;
var tbody;

function display(rows){
  thead = document.getElementById("responseTableHeader");
  tbody = document.getElementById("responseTableBody");
  tbody.innerHTML = ""
  thead.innerHTML = ""
  displayHeader(rows[0])
  displayRowS(rows)
}
function displayHeader(headerRow){
  var th
  var key
  for(key in headerRow){
    th = document.createElement("th");
    th.innerHTML = key;
    thead.appendChild(th)
  }
}
function displayRowS(rows){
  var row,tr
  var i
  for(i=0; i<rows.length; i++){
    row = rows[i];
    tr = document.createElement("tr");
    document.getElementById("responseTableHeader").appendChild(tr)
    displayRow(tr,row)
  }
}
function displayRow(tr,row){
  var td,key,val;
  for(key in row){
    td = document.createElement("td");
    val = row[key];
    td.innerHTML = val;
    tr.appendChild(td)
  }
}


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return m; });

var m = {};


m.foreach = foreach

var holder = {

  "count TSN Vidi Web":
      `SELECT COUNT(0)
      FROM SSD1
      WHERE session_tags LIKE '%c3.player.name=TSN+VIDI+Web%'
      AND  starttime >= 1516047600
      AND  starttime < 1516048500
      AND  startuptime = -1;`

  ,"list frist 10 rows":
      `SELECT
      * FROM SSD1
      LIMIT 5`

}
function foreach(func){ //(lbl,query)
  var key;
  for(key in holder){
    func(key,holder[key])
  }
}


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return m; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__apiHandler_js__ = __webpack_require__(0);
//https://conviva.app.box.com/developers/console/app/536698/configuration



var m = {};



m.init = init;

var authCode

//https://github.com/github/fetch
var btn_template
function init(){
  // if called from box:
  // https://127.0.0.1/?from_box=1&state=security_tokens90&code=Y1Le0FPRwZHYfhRP8kTflVYGLtqiXv6G
  console.log('boxHandler.init()');
  checkForBoxUserToken()
  onWindowLoad(function(){
    document.getElementById("btn_boxLogon").addEventListener("click", boxLogon);
  })
}



function checkForBoxUserToken(){
  //https://127.0.0.1/?from_box=1&state=security_tokens90&code=Y1Le0FPRwZHYfhRP8kTflVYGLtqiXv6G
  var uri = document.location.toString();
  var params = {}
  uri.replace(
    new RegExp("([^?=&]+)(=([^&]*))?", "g"),
    function($0, $1, $2, $3) { params[$1] = $3; }
  );
  authCode = params.code
}

function boxLogon(){
  if(!authCode){
    getBox_OAuth_URL();
    return
  }

  folderListing()

}

function folderListing(){
  var folderID = ""
  call("folderListing",{folderID:folderID},function(success, apiResponse){
    if( success ){
      onFolderListing(apiResponse)
    }
    else{
      console.log("folderListing error: "+ JSON.stringify(objResp))
    }
  })
}

function onFolderListing(apiResponse){
  debugger
}

function getBox_OAuth_URL(){
  var username = null;
  call("OAuthUrl",{username:username},function(success, apiResponse){
    if( success ){
      on_box_OAuth_URL(apiResponse.url)
    }
    else{
      console.log("getBox_OAuth_URL error: "+ JSON.stringify(objResp))
    }
  })
}

function on_box_OAuth_URL(url){
  debugger
  document.location = url
}

function call(method,params,callback){
  params = params || {}
  params.authCode = authCode
  params.method = method
  __WEBPACK_IMPORTED_MODULE_0__apiHandler_js__["a" /* apiHandler */].call('box',params,function(success, objResp){
    if( success ){
      callback(true,objResp.apiResponse)
    }
    else{
      callback(false,objResp)
    }
  })
}

function onWindowLoad(f){
  document.addEventListener("DOMContentLoaded", function(event) {
    f();
  });
}


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNWZjMmE0NjlmNmZiYTQyN2ZiNzkiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50LmpzLnNyYy9hcGlIYW5kbGVyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC5qcy5zcmMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQuanMuc3JjL3N1Ym1pdEhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50LmpzLnNyYy9kaXNwbGF5UmVzcG9uc2VSb3dzLmpzIiwid2VicGFjazovLy8uL2NsaWVudC5qcy5zcmMvcXVlcnlNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC5qcy5zcmMvYm94SGFuZGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7O0FDN0RBO0FBQUE7QUFDUTs7QUFFUjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsTUFBTTs7O0FBR3BDO0FBQ0EscUJBQXFCLFFBQVE7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsSUFBSSxhQUFhLHFCQUFxQixjQUFjLGVBQWU7O0FBRTdGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULDJCQUEyQiwyREFBMkQ7QUFDdEY7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLHNCQUFzQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTs7Ozs7Ozs7Ozs7QUN6RHVDO0FBQ047QUFDakM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNUaUM7QUFDa0I7QUFDZDtBQUNyQzs7QUFFQTtBQUNROztBQUVSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7Ozs7Ozs7OztBQzdEaUM7O0FBRWpDO0FBQ0E7O0FBRVE7O0FBRVI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxlQUFlO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQzVDQTtBQUNROztBQUVSOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qjs7QUFFNUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDM0JBO0FBQUE7QUFDaUM7OztBQUdqQztBQUNROzs7QUFHUjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsaUJBQWlCO0FBQy9DO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSx3QkFBd0Isa0JBQWtCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQixrQkFBa0I7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIIiwiZmlsZSI6ImFwcC5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA1ZmMyYTQ2OWY2ZmJhNDI3ZmI3OSIsInZhciBtID0ge307XG5leHBvcnQge20gYXMgYXBpSGFuZGxlcn07XG5cbi8vaHR0cHM6Ly9naXRodWIuY29tL2dpdGh1Yi9mZXRjaFxuXG5tLnF1ZXJ5ID0gcXVlcnk7XG5tLmFib3V0ID0gYWJvdXQ7XG5tLmNhbGwgPSBjYWxsO1xudmFyIHNlc3Npb25Ub2tlbiA9IFwiZHNhZmtqaGRrO2FmamhkO2FrZmpoZXdcIiAvLyB0b2RvXG5cblxuZnVuY3Rpb24gcXVlcnkoc3FsLGNhbGxiYWNrKXtcbiAgY2FsbCgncXVlcnkuY2FsbCcse3NxbDpzcWx9LGNhbGxiYWNrKVxufVxuZnVuY3Rpb24gYWJvdXQocGFyYW1PYmosY2FsbGJhY2spe1xuICBjYWxsKCdhYm91dC5hbGwnLHBhcmFtT2JqLGNhbGxiYWNrKVxufVxuZnVuY3Rpb24gY2FsbChtZXRob2RQYXRoLG1ldGhvZFBhcmFtLGNhbGxiYWNrKXtcbiAgaWYgKHR5cGVvZiBtZXRob2RQYXJhbSA9PSAnb2JqZWN0JykgbWV0aG9kUGFyYW0gPSBKU09OLnN0cmluZ2lmeShtZXRob2RQYXJhbSlcblxuICB2YXIgZGF0YSA9IHtcbiAgICB2ZXJzaW9uOlwidmVyLjAwLjAwLjAwMVwiLFxuICAgIG1ldGhvZFBhdGg6IG1ldGhvZFBhdGgsXG4gICAgbWV0aG9kUGFyYW06bWV0aG9kUGFyYW0sXG4gICAgc2Vzc2lvblRva2VuOnNlc3Npb25Ub2tlblxuICB9XG4gIHBvc3QoXCIvYXBpXCIsZGF0YSxjYWxsYmFjaylcbn1cbmZ1bmN0aW9uIHBvc3QodXJsLGRhdGEsY2FsbGJhY2spe1xuICBkYXRhID0gZGF0YSB8fCB7fVxuICB2YXIgc3RyRW5jb2RlZERhdGEgPSBlbmNvZGVEYXRhKGRhdGEpXG4gIGNvbnNvbGUubG9nKGBzZW5kaW5nOiAke3VybH0gOiBcXG5kYXRhOiAke0pTT04uc3RyaW5naWZ5KGRhdGEpfSBcXG4gZW5jb2RlZDoke3N0ckVuY29kZWREYXRhfSBgKVxuXG4gIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgcmVxLm9wZW4oJ1BPU1QnLCB1cmwpO1xuICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAocmVxLnJlYWR5U3RhdGU+MyAmJiByZXEuc3RhdHVzPT0yMDApe1xuICAgICAgICB0cnl7XG4gICAgICAgICAgdmFyIG9ialJlc3AgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpXG4gICAgICAgICAgY2FsbGJhY2sodHJ1ZSwgb2JqUmVzcClcbiAgICAgICAgfWNhdGNoKGUpe1xuICAgICAgICAgIGNhbGxiYWNrKGZhbHNlLCB7bXNnOlwiYmFkIEpTT05cIixyZXNwb25zZVRleHQ6cmVxLnJlc3BvbnNlVGV4dCwgaW5uZXJFcnJvcjplfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlPjMgJiYgcmVxLnN0YXR1cyE9MjAwKXtcbiAgICAgICAgY2FsbGJhY2soZmFsc2UsIHttc2c6XCJyZXEuc3RhdHVzIT0yMDBcIn0pXG4gICAgICB9XG4gIH07XG4gIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKCdYLVJlcXVlc3RlZC1XaXRoJywgJ1hNTEh0dHBSZXF1ZXN0Jyk7XG4gIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XG4gIHJlcS5zZW5kKHN0ckVuY29kZWREYXRhKTtcbiAgcmV0dXJuIHJlcTtcbn1cbmZ1bmN0aW9uIGVuY29kZURhdGEoZGF0YSl7XG4gIHJldHVybiB0eXBlb2YgZGF0YSA9PSAnc3RyaW5nJyA/IGRhdGEgOiBPYmplY3Qua2V5cyhkYXRhKS5tYXAoXG4gICAgICAgICAgICBmdW5jdGlvbihrKXsgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChrKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChkYXRhW2tdKSB9XG4gICkuam9pbignJicpO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9jbGllbnQuanMuc3JjL2FwaUhhbmRsZXIuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHtzdWJtaXRIYW5kbGVyIGFzIHN1Ym1pdEhhbmRsZXJ9IGZyb20gJy4vc3VibWl0SGFuZGxlci5qcyc7XG5pbXBvcnQge2JveEhhbmRsZXIgYXMgYm94SGFuZGxlcn0gZnJvbSAnLi9ib3hIYW5kbGVyLmpzJztcbi8vIERPQ1M9XCIvVXNlcnMvZ3NpbHZlc3RyaS9Hb29nbGUgRHJpdmUvZGV2L1NTRFF1ZXJ5L2NsaWVudFwiXG4vLyBjZCBcIiRET0NTXCJcbi8vIG5wbSBydW4gYnVpbGRcblxuLy9jb25zb2xlLmxvZyhcImluZGV4LmpzOiBcIisgY29tcDEpXG5jb25zb2xlLmxvZyhcImluZGV4LmpzXCIpO1xuc3VibWl0SGFuZGxlci5pbml0KCk7XG5ib3hIYW5kbGVyLmluaXQoKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vY2xpZW50LmpzLnNyYy9tYWluLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7YXBpSGFuZGxlciBhcyBhcGlIYW5kbGVyfSBmcm9tICcuL2FwaUhhbmRsZXIuanMnO1xuaW1wb3J0IHtkaXNwbGF5UmVzcG9uc2VSb3dzIGFzIGRpc3BsYXlSZXNwb25zZVJvd3N9IGZyb20gJy4vZGlzcGxheVJlc3BvbnNlUm93cy5qcyc7XG5pbXBvcnQge3F1ZXJ5TWFuYWdlciBhcyBxdWVyeU1hbmFnZXJ9IGZyb20gJy4vcXVlcnlNYW5hZ2VyLmpzJztcbnF1ZXJ5TWFuYWdlclxuXG52YXIgbSA9IHt9O1xuZXhwb3J0IHttIGFzIHN1Ym1pdEhhbmRsZXJ9O1xuXG4vL2h0dHBzOi8vZ2l0aHViLmNvbS9naXRodWIvZmV0Y2hcbnZhciBidG5fdGVtcGxhdGVcbm0uaW5pdCA9IGZ1bmN0aW9uKCl7XG4gIGNvbnNvbGUubG9nKCdzdWJtaXRIYW5kbGVyLmluaXQoKTInKTtcbiAgb25XaW5kb3dMb2FkKGZ1bmN0aW9uKCl7XG4gICAgLy9kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bl9xdWVyeVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcXVlcnkpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuX2Fib3V0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhYm91dCk7XG4gICAgc2V0UHJlZGVmaW5lZFF1ZXJpZXMoKTtcbiAgfSlcbn1cblxuZnVuY3Rpb24gc2V0UHJlZGVmaW5lZFF1ZXJpZXMoKXtcbiAgYnRuX3RlbXBsYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG5fdGVtcGxhdGVcIilcbiAgdmFyIHBhcmVudE5vZGUgPSBidG5fdGVtcGxhdGUucGFyZW50Tm9kZTtcbiAgcGFyZW50Tm9kZS5yZW1vdmVDaGlsZChidG5fdGVtcGxhdGUpO1xuICB2YXIgYnRuXG4gIHF1ZXJ5TWFuYWdlci5mb3JlYWNoKGZ1bmN0aW9uKGxibCxxdWVyeVN0cil7XG4gICAgYnRuID0gYnRuX3RlbXBsYXRlLmNsb25lTm9kZSh0cnVlKVxuICAgIHBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoYnRuKTtcbiAgICBidG4uaW5uZXJIVE1MID0gbGJsXG4gICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuICAgICAgcXVlcnkocXVlcnlTdHIpXG4gICAgfSk7XG4gIH0pXG59XG5cbmZ1bmN0aW9uIHF1ZXJ5KHF1ZXJ5U3RyKXtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnB1dDFcIikudmFsdWUgPSBxdWVyeVN0clxuICBhcGlIYW5kbGVyLnF1ZXJ5KHF1ZXJ5U3RyLGZ1bmN0aW9uKHN1Y2Nlc3MsIG9ialJlc3Ape1xuICAgIGlmKCBzdWNjZXNzICl7XG4gICAgICAvL2NvbnNvbGUubG9nKFwicXVlcnkgc3VjY2VzczogXCIrIEpTT04uc3RyaW5naWZ5KG9ialJlc3ApKVxuICAgICAgZGlzcGxheVJlc3BvbnNlUm93cy5kaXNwbGF5KG9ialJlc3AuYXBpUmVzcG9uc2Uucm93cylcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIGNvbnNvbGUubG9nKFwicXVlcnkgZXJyb3I6IFwiKyBKU09OLnN0cmluZ2lmeShvYmpSZXNwKSlcbiAgICB9XG4gIH0pXG59XG5mdW5jdGlvbiBhYm91dCgpe1xuICB2YXIgbWlzY1BhcmFtcyA9IHthOjEsYjoyfVxuICBhcGlIYW5kbGVyLmFib3V0KG1pc2NQYXJhbXMsZnVuY3Rpb24oc3VjY2Vzcywgb2JqUmVzcCl7XG4gICAgaWYoIHN1Y2Nlc3MgKXtcbiAgICAgIGNvbnNvbGUubG9nKFwiYWJvdXQgc3VjY2VzczogXCIrIEpTT04uc3RyaW5naWZ5KG9ialJlc3ApKVxuICAgIH1cbiAgICBlbHNle1xuICAgICAgY29uc29sZS5sb2coXCJhYm91dCBlcnJvcjogXCIrIEpTT04uc3RyaW5naWZ5KG9ialJlc3ApKVxuICAgIH1cbiAgfSlcbn1cbmZ1bmN0aW9uIG9uV2luZG93TG9hZChmKXtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBmKCk7XG4gIH0pO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9jbGllbnQuanMuc3JjL3N1Ym1pdEhhbmRsZXIuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHthcGlIYW5kbGVyIGFzIGFwaUhhbmRsZXJ9IGZyb20gJy4vYXBpSGFuZGxlci5qcyc7XG5cbnZhciBtID0ge307XG5tLmRpc3BsYXkgPSBkaXNwbGF5O1xuXG5leHBvcnQge20gYXMgZGlzcGxheVJlc3BvbnNlUm93c307XG5cbnZhciB0aGVhZDtcbnZhciB0Ym9keTtcblxuZnVuY3Rpb24gZGlzcGxheShyb3dzKXtcbiAgdGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3BvbnNlVGFibGVIZWFkZXJcIik7XG4gIHRib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXNwb25zZVRhYmxlQm9keVwiKTtcbiAgdGJvZHkuaW5uZXJIVE1MID0gXCJcIlxuICB0aGVhZC5pbm5lckhUTUwgPSBcIlwiXG4gIGRpc3BsYXlIZWFkZXIocm93c1swXSlcbiAgZGlzcGxheVJvd1Mocm93cylcbn1cbmZ1bmN0aW9uIGRpc3BsYXlIZWFkZXIoaGVhZGVyUm93KXtcbiAgdmFyIHRoXG4gIHZhciBrZXlcbiAgZm9yKGtleSBpbiBoZWFkZXJSb3cpe1xuICAgIHRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRoXCIpO1xuICAgIHRoLmlubmVySFRNTCA9IGtleTtcbiAgICB0aGVhZC5hcHBlbmRDaGlsZCh0aClcbiAgfVxufVxuZnVuY3Rpb24gZGlzcGxheVJvd1Mocm93cyl7XG4gIHZhciByb3csdHJcbiAgdmFyIGlcbiAgZm9yKGk9MDsgaTxyb3dzLmxlbmd0aDsgaSsrKXtcbiAgICByb3cgPSByb3dzW2ldO1xuICAgIHRyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRyXCIpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzcG9uc2VUYWJsZUhlYWRlclwiKS5hcHBlbmRDaGlsZCh0cilcbiAgICBkaXNwbGF5Um93KHRyLHJvdylcbiAgfVxufVxuZnVuY3Rpb24gZGlzcGxheVJvdyh0cixyb3cpe1xuICB2YXIgdGQsa2V5LHZhbDtcbiAgZm9yKGtleSBpbiByb3cpe1xuICAgIHRkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRkXCIpO1xuICAgIHZhbCA9IHJvd1trZXldO1xuICAgIHRkLmlubmVySFRNTCA9IHZhbDtcbiAgICB0ci5hcHBlbmRDaGlsZCh0ZClcbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9jbGllbnQuanMuc3JjL2Rpc3BsYXlSZXNwb25zZVJvd3MuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXG52YXIgbSA9IHt9O1xuZXhwb3J0IHttIGFzIHF1ZXJ5TWFuYWdlcn07XG5cbm0uZm9yZWFjaCA9IGZvcmVhY2hcblxudmFyIGhvbGRlciA9IHtcblxuICBcImNvdW50IFRTTiBWaWRpIFdlYlwiOlxuICAgICAgYFNFTEVDVCBDT1VOVCgwKVxuICAgICAgRlJPTSBTU0QxXG4gICAgICBXSEVSRSBzZXNzaW9uX3RhZ3MgTElLRSAnJWMzLnBsYXllci5uYW1lPVRTTitWSURJK1dlYiUnXG4gICAgICBBTkQgIHN0YXJ0dGltZSA+PSAxNTE2MDQ3NjAwXG4gICAgICBBTkQgIHN0YXJ0dGltZSA8IDE1MTYwNDg1MDBcbiAgICAgIEFORCAgc3RhcnR1cHRpbWUgPSAtMTtgXG5cbiAgLFwibGlzdCBmcmlzdCAxMCByb3dzXCI6XG4gICAgICBgU0VMRUNUXG4gICAgICAqIEZST00gU1NEMVxuICAgICAgTElNSVQgNWBcblxufVxuZnVuY3Rpb24gZm9yZWFjaChmdW5jKXsgLy8obGJsLHF1ZXJ5KVxuICB2YXIga2V5O1xuICBmb3Ioa2V5IGluIGhvbGRlcil7XG4gICAgZnVuYyhrZXksaG9sZGVyW2tleV0pXG4gIH1cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vY2xpZW50LmpzLnNyYy9xdWVyeU1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy9odHRwczovL2NvbnZpdmEuYXBwLmJveC5jb20vZGV2ZWxvcGVycy9jb25zb2xlL2FwcC81MzY2OTgvY29uZmlndXJhdGlvblxuaW1wb3J0IHthcGlIYW5kbGVyIGFzIGFwaUhhbmRsZXJ9IGZyb20gJy4vYXBpSGFuZGxlci5qcyc7XG5cblxudmFyIG0gPSB7fTtcbmV4cG9ydCB7bSBhcyBib3hIYW5kbGVyfTtcblxuXG5tLmluaXQgPSBpbml0O1xuXG52YXIgYXV0aENvZGVcblxuLy9odHRwczovL2dpdGh1Yi5jb20vZ2l0aHViL2ZldGNoXG52YXIgYnRuX3RlbXBsYXRlXG5mdW5jdGlvbiBpbml0KCl7XG4gIC8vIGlmIGNhbGxlZCBmcm9tIGJveDpcbiAgLy8gaHR0cHM6Ly8xMjcuMC4wLjEvP2Zyb21fYm94PTEmc3RhdGU9c2VjdXJpdHlfdG9rZW5zOTAmY29kZT1ZMUxlMEZQUndaSFlmaFJQOGtUZmxWWUdMdHFpWHY2R1xuICBjb25zb2xlLmxvZygnYm94SGFuZGxlci5pbml0KCknKTtcbiAgY2hlY2tGb3JCb3hVc2VyVG9rZW4oKVxuICBvbldpbmRvd0xvYWQoZnVuY3Rpb24oKXtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bl9ib3hMb2dvblwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYm94TG9nb24pO1xuICB9KVxufVxuXG5cblxuZnVuY3Rpb24gY2hlY2tGb3JCb3hVc2VyVG9rZW4oKXtcbiAgLy9odHRwczovLzEyNy4wLjAuMS8/ZnJvbV9ib3g9MSZzdGF0ZT1zZWN1cml0eV90b2tlbnM5MCZjb2RlPVkxTGUwRlBSd1pIWWZoUlA4a1RmbFZZR0x0cWlYdjZHXG4gIHZhciB1cmkgPSBkb2N1bWVudC5sb2NhdGlvbi50b1N0cmluZygpO1xuICB2YXIgcGFyYW1zID0ge31cbiAgdXJpLnJlcGxhY2UoXG4gICAgbmV3IFJlZ0V4cChcIihbXj89Jl0rKSg9KFteJl0qKSk/XCIsIFwiZ1wiKSxcbiAgICBmdW5jdGlvbigkMCwgJDEsICQyLCAkMykgeyBwYXJhbXNbJDFdID0gJDM7IH1cbiAgKTtcbiAgYXV0aENvZGUgPSBwYXJhbXMuY29kZVxufVxuXG5mdW5jdGlvbiBib3hMb2dvbigpe1xuICBpZighYXV0aENvZGUpe1xuICAgIGdldEJveF9PQXV0aF9VUkwoKTtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGZvbGRlckxpc3RpbmcoKVxuXG59XG5cbmZ1bmN0aW9uIGZvbGRlckxpc3RpbmcoKXtcbiAgdmFyIGZvbGRlcklEID0gXCJcIlxuICBjYWxsKFwiZm9sZGVyTGlzdGluZ1wiLHtmb2xkZXJJRDpmb2xkZXJJRH0sZnVuY3Rpb24oc3VjY2VzcywgYXBpUmVzcG9uc2Upe1xuICAgIGlmKCBzdWNjZXNzICl7XG4gICAgICBvbkZvbGRlckxpc3RpbmcoYXBpUmVzcG9uc2UpXG4gICAgfVxuICAgIGVsc2V7XG4gICAgICBjb25zb2xlLmxvZyhcImZvbGRlckxpc3RpbmcgZXJyb3I6IFwiKyBKU09OLnN0cmluZ2lmeShvYmpSZXNwKSlcbiAgICB9XG4gIH0pXG59XG5cbmZ1bmN0aW9uIG9uRm9sZGVyTGlzdGluZyhhcGlSZXNwb25zZSl7XG4gIGRlYnVnZ2VyXG59XG5cbmZ1bmN0aW9uIGdldEJveF9PQXV0aF9VUkwoKXtcbiAgdmFyIHVzZXJuYW1lID0gbnVsbDtcbiAgY2FsbChcIk9BdXRoVXJsXCIse3VzZXJuYW1lOnVzZXJuYW1lfSxmdW5jdGlvbihzdWNjZXNzLCBhcGlSZXNwb25zZSl7XG4gICAgaWYoIHN1Y2Nlc3MgKXtcbiAgICAgIG9uX2JveF9PQXV0aF9VUkwoYXBpUmVzcG9uc2UudXJsKVxuICAgIH1cbiAgICBlbHNle1xuICAgICAgY29uc29sZS5sb2coXCJnZXRCb3hfT0F1dGhfVVJMIGVycm9yOiBcIisgSlNPTi5zdHJpbmdpZnkob2JqUmVzcCkpXG4gICAgfVxuICB9KVxufVxuXG5mdW5jdGlvbiBvbl9ib3hfT0F1dGhfVVJMKHVybCl7XG4gIGRlYnVnZ2VyXG4gIGRvY3VtZW50LmxvY2F0aW9uID0gdXJsXG59XG5cbmZ1bmN0aW9uIGNhbGwobWV0aG9kLHBhcmFtcyxjYWxsYmFjayl7XG4gIHBhcmFtcyA9IHBhcmFtcyB8fCB7fVxuICBwYXJhbXMuYXV0aENvZGUgPSBhdXRoQ29kZVxuICBwYXJhbXMubWV0aG9kID0gbWV0aG9kXG4gIGFwaUhhbmRsZXIuY2FsbCgnYm94JyxwYXJhbXMsZnVuY3Rpb24oc3VjY2Vzcywgb2JqUmVzcCl7XG4gICAgaWYoIHN1Y2Nlc3MgKXtcbiAgICAgIGNhbGxiYWNrKHRydWUsb2JqUmVzcC5hcGlSZXNwb25zZSlcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIGNhbGxiYWNrKGZhbHNlLG9ialJlc3ApXG4gICAgfVxuICB9KVxufVxuXG5mdW5jdGlvbiBvbldpbmRvd0xvYWQoZil7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgZigpO1xuICB9KTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vY2xpZW50LmpzLnNyYy9ib3hIYW5kbGVyLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=