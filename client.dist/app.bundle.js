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
    document.getElementById("btn_importSSD").addEventListener("click", importSSD);

    setPredefinedQueries();
  })
}
function importSSD(){
  var methodParam ={
    ddd:"ssss"
  }
  __WEBPACK_IMPORTED_MODULE_0__apiHandler_js__["a" /* apiHandler */].call("ssd.importSSD",methodParam,function(success, objResp){
    if( success ){
      console.log("importSSD success: "+ JSON.stringify(objResp))
    }
    else{
      console.log("importSSD error: "+ JSON.stringify(objResp))
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTI4N2Q2NDk5MGY1NDdiNmRhNWYiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50LmpzLnNyYy9hcGlIYW5kbGVyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC5qcy5zcmMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQuanMuc3JjL3N1Ym1pdEhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50LmpzLnNyYy9kaXNwbGF5UmVzcG9uc2VSb3dzLmpzIiwid2VicGFjazovLy8uL2NsaWVudC5qcy5zcmMvcXVlcnlNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC5qcy5zcmMvYm94SGFuZGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7O0FDN0RBO0FBQUE7QUFDUTs7QUFFUjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsTUFBTTs7O0FBR3BDO0FBQ0EscUJBQXFCLFFBQVE7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsSUFBSSxhQUFhLHFCQUFxQixjQUFjLGVBQWU7O0FBRTdGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULDJCQUEyQiwyREFBMkQ7QUFDdEY7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLHNCQUFzQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTs7Ozs7Ozs7Ozs7QUN6RHVDO0FBQ047QUFDakM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNUaUM7QUFDa0I7QUFDZDtBQUNyQzs7QUFFQTtBQUNROztBQUVSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOzs7Ozs7Ozs7O0FDMUVpQzs7QUFFakM7QUFDQTs7QUFFUTs7QUFFUjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLGVBQWU7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDNUNBO0FBQ1E7O0FBRVI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCOztBQUU1QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUMzQkE7QUFBQTtBQUNpQzs7O0FBR2pDO0FBQ1E7OztBQUdSOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixpQkFBaUI7QUFDL0M7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLHdCQUF3QixrQkFBa0I7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLGtCQUFrQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0giLCJmaWxlIjoiYXBwLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDEpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGEyODdkNjQ5OTBmNTQ3YjZkYTVmIiwidmFyIG0gPSB7fTtcbmV4cG9ydCB7bSBhcyBhcGlIYW5kbGVyfTtcblxuLy9odHRwczovL2dpdGh1Yi5jb20vZ2l0aHViL2ZldGNoXG5cbm0ucXVlcnkgPSBxdWVyeTtcbm0uYWJvdXQgPSBhYm91dDtcbm0uY2FsbCA9IGNhbGw7XG52YXIgc2Vzc2lvblRva2VuID0gXCJkc2Fma2poZGs7YWZqaGQ7YWtmamhld1wiIC8vIHRvZG9cblxuXG5mdW5jdGlvbiBxdWVyeShzcWwsY2FsbGJhY2spe1xuICBjYWxsKCdxdWVyeS5jYWxsJyx7c3FsOnNxbH0sY2FsbGJhY2spXG59XG5mdW5jdGlvbiBhYm91dChwYXJhbU9iaixjYWxsYmFjayl7XG4gIGNhbGwoJ2Fib3V0LmFsbCcscGFyYW1PYmosY2FsbGJhY2spXG59XG5mdW5jdGlvbiBjYWxsKG1ldGhvZFBhdGgsbWV0aG9kUGFyYW0sY2FsbGJhY2spe1xuICBpZiAodHlwZW9mIG1ldGhvZFBhcmFtID09ICdvYmplY3QnKSBtZXRob2RQYXJhbSA9IEpTT04uc3RyaW5naWZ5KG1ldGhvZFBhcmFtKVxuXG4gIHZhciBkYXRhID0ge1xuICAgIHZlcnNpb246XCJ2ZXIuMDAuMDAuMDAxXCIsXG4gICAgbWV0aG9kUGF0aDogbWV0aG9kUGF0aCxcbiAgICBtZXRob2RQYXJhbTptZXRob2RQYXJhbSxcbiAgICBzZXNzaW9uVG9rZW46c2Vzc2lvblRva2VuXG4gIH1cbiAgcG9zdChcIi9hcGlcIixkYXRhLGNhbGxiYWNrKVxufVxuZnVuY3Rpb24gcG9zdCh1cmwsZGF0YSxjYWxsYmFjayl7XG4gIGRhdGEgPSBkYXRhIHx8IHt9XG4gIHZhciBzdHJFbmNvZGVkRGF0YSA9IGVuY29kZURhdGEoZGF0YSlcbiAgY29uc29sZS5sb2coYHNlbmRpbmc6ICR7dXJsfSA6IFxcbmRhdGE6ICR7SlNPTi5zdHJpbmdpZnkoZGF0YSl9IFxcbiBlbmNvZGVkOiR7c3RyRW5jb2RlZERhdGF9IGApXG5cbiAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICByZXEub3BlbignUE9TVCcsIHVybCk7XG4gIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChyZXEucmVhZHlTdGF0ZT4zICYmIHJlcS5zdGF0dXM9PTIwMCl7XG4gICAgICAgIHRyeXtcbiAgICAgICAgICB2YXIgb2JqUmVzcCA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dClcbiAgICAgICAgICBjYWxsYmFjayh0cnVlLCBvYmpSZXNwKVxuICAgICAgICB9Y2F0Y2goZSl7XG4gICAgICAgICAgY2FsbGJhY2soZmFsc2UsIHttc2c6XCJiYWQgSlNPTlwiLHJlc3BvbnNlVGV4dDpyZXEucmVzcG9uc2VUZXh0LCBpbm5lckVycm9yOmV9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocmVxLnJlYWR5U3RhdGU+MyAmJiByZXEuc3RhdHVzIT0yMDApe1xuICAgICAgICBjYWxsYmFjayhmYWxzZSwge21zZzpcInJlcS5zdGF0dXMhPTIwMFwifSlcbiAgICAgIH1cbiAgfTtcbiAgcmVxLnNldFJlcXVlc3RIZWFkZXIoJ1gtUmVxdWVzdGVkLVdpdGgnLCAnWE1MSHR0cFJlcXVlc3QnKTtcbiAgcmVxLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcbiAgcmVxLnNlbmQoc3RyRW5jb2RlZERhdGEpO1xuICByZXR1cm4gcmVxO1xufVxuZnVuY3Rpb24gZW5jb2RlRGF0YShkYXRhKXtcbiAgcmV0dXJuIHR5cGVvZiBkYXRhID09ICdzdHJpbmcnID8gZGF0YSA6IE9iamVjdC5rZXlzKGRhdGEpLm1hcChcbiAgICAgICAgICAgIGZ1bmN0aW9uKGspeyByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KGspICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGRhdGFba10pIH1cbiAgKS5qb2luKCcmJyk7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2NsaWVudC5qcy5zcmMvYXBpSGFuZGxlci5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQge3N1Ym1pdEhhbmRsZXIgYXMgc3VibWl0SGFuZGxlcn0gZnJvbSAnLi9zdWJtaXRIYW5kbGVyLmpzJztcbmltcG9ydCB7Ym94SGFuZGxlciBhcyBib3hIYW5kbGVyfSBmcm9tICcuL2JveEhhbmRsZXIuanMnO1xuLy8gRE9DUz1cIi9Vc2Vycy9nc2lsdmVzdHJpL0dvb2dsZSBEcml2ZS9kZXYvU1NEUXVlcnkvY2xpZW50XCJcbi8vIGNkIFwiJERPQ1NcIlxuLy8gbnBtIHJ1biBidWlsZFxuXG4vL2NvbnNvbGUubG9nKFwiaW5kZXguanM6IFwiKyBjb21wMSlcbmNvbnNvbGUubG9nKFwiaW5kZXguanNcIik7XG5zdWJtaXRIYW5kbGVyLmluaXQoKTtcbmJveEhhbmRsZXIuaW5pdCgpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9jbGllbnQuanMuc3JjL21haW4uanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHthcGlIYW5kbGVyIGFzIGFwaUhhbmRsZXJ9IGZyb20gJy4vYXBpSGFuZGxlci5qcyc7XG5pbXBvcnQge2Rpc3BsYXlSZXNwb25zZVJvd3MgYXMgZGlzcGxheVJlc3BvbnNlUm93c30gZnJvbSAnLi9kaXNwbGF5UmVzcG9uc2VSb3dzLmpzJztcbmltcG9ydCB7cXVlcnlNYW5hZ2VyIGFzIHF1ZXJ5TWFuYWdlcn0gZnJvbSAnLi9xdWVyeU1hbmFnZXIuanMnO1xucXVlcnlNYW5hZ2VyXG5cbnZhciBtID0ge307XG5leHBvcnQge20gYXMgc3VibWl0SGFuZGxlcn07XG5cbi8vaHR0cHM6Ly9naXRodWIuY29tL2dpdGh1Yi9mZXRjaFxudmFyIGJ0bl90ZW1wbGF0ZVxubS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgY29uc29sZS5sb2coJ3N1Ym1pdEhhbmRsZXIuaW5pdCgpMicpO1xuICBvbldpbmRvd0xvYWQoZnVuY3Rpb24oKXtcbiAgICAvL2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuX3F1ZXJ5XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBxdWVyeSk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG5fYWJvdXRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFib3V0KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bl9pbXBvcnRTU0RcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGltcG9ydFNTRCk7XG5cbiAgICBzZXRQcmVkZWZpbmVkUXVlcmllcygpO1xuICB9KVxufVxuZnVuY3Rpb24gaW1wb3J0U1NEKCl7XG4gIHZhciBtZXRob2RQYXJhbSA9e1xuICAgIGRkZDpcInNzc3NcIlxuICB9XG4gIGFwaUhhbmRsZXIuY2FsbChcInNzZC5pbXBvcnRTU0RcIixtZXRob2RQYXJhbSxmdW5jdGlvbihzdWNjZXNzLCBvYmpSZXNwKXtcbiAgICBpZiggc3VjY2VzcyApe1xuICAgICAgY29uc29sZS5sb2coXCJpbXBvcnRTU0Qgc3VjY2VzczogXCIrIEpTT04uc3RyaW5naWZ5KG9ialJlc3ApKVxuICAgIH1cbiAgICBlbHNle1xuICAgICAgY29uc29sZS5sb2coXCJpbXBvcnRTU0QgZXJyb3I6IFwiKyBKU09OLnN0cmluZ2lmeShvYmpSZXNwKSlcbiAgICB9XG4gIH0pXG59XG5mdW5jdGlvbiBzZXRQcmVkZWZpbmVkUXVlcmllcygpe1xuICBidG5fdGVtcGxhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bl90ZW1wbGF0ZVwiKVxuICB2YXIgcGFyZW50Tm9kZSA9IGJ0bl90ZW1wbGF0ZS5wYXJlbnROb2RlO1xuICBwYXJlbnROb2RlLnJlbW92ZUNoaWxkKGJ0bl90ZW1wbGF0ZSk7XG4gIHZhciBidG5cbiAgcXVlcnlNYW5hZ2VyLmZvcmVhY2goZnVuY3Rpb24obGJsLHF1ZXJ5U3RyKXtcbiAgICBidG4gPSBidG5fdGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpXG4gICAgcGFyZW50Tm9kZS5hcHBlbmRDaGlsZChidG4pO1xuICAgIGJ0bi5pbm5lckhUTUwgPSBsYmxcbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG4gICAgICBxdWVyeShxdWVyeVN0cilcbiAgICB9KTtcbiAgfSlcbn1cbmZ1bmN0aW9uIHF1ZXJ5KHF1ZXJ5U3RyKXtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnB1dDFcIikudmFsdWUgPSBxdWVyeVN0clxuICBhcGlIYW5kbGVyLnF1ZXJ5KHF1ZXJ5U3RyLGZ1bmN0aW9uKHN1Y2Nlc3MsIG9ialJlc3Ape1xuICAgIGlmKCBzdWNjZXNzICl7XG4gICAgICAvL2NvbnNvbGUubG9nKFwicXVlcnkgc3VjY2VzczogXCIrIEpTT04uc3RyaW5naWZ5KG9ialJlc3ApKVxuICAgICAgZGlzcGxheVJlc3BvbnNlUm93cy5kaXNwbGF5KG9ialJlc3AuYXBpUmVzcG9uc2Uucm93cylcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIGNvbnNvbGUubG9nKFwicXVlcnkgZXJyb3I6IFwiKyBKU09OLnN0cmluZ2lmeShvYmpSZXNwKSlcbiAgICB9XG4gIH0pXG59XG5mdW5jdGlvbiBhYm91dCgpe1xuICB2YXIgbWlzY1BhcmFtcyA9IHthOjEsYjoyfVxuICBhcGlIYW5kbGVyLmFib3V0KG1pc2NQYXJhbXMsZnVuY3Rpb24oc3VjY2Vzcywgb2JqUmVzcCl7XG4gICAgaWYoIHN1Y2Nlc3MgKXtcbiAgICAgIGNvbnNvbGUubG9nKFwiYWJvdXQgc3VjY2VzczogXCIrIEpTT04uc3RyaW5naWZ5KG9ialJlc3ApKVxuICAgIH1cbiAgICBlbHNle1xuICAgICAgY29uc29sZS5sb2coXCJhYm91dCBlcnJvcjogXCIrIEpTT04uc3RyaW5naWZ5KG9ialJlc3ApKVxuICAgIH1cbiAgfSlcbn1cbmZ1bmN0aW9uIG9uV2luZG93TG9hZChmKXtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBmKCk7XG4gIH0pO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9jbGllbnQuanMuc3JjL3N1Ym1pdEhhbmRsZXIuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHthcGlIYW5kbGVyIGFzIGFwaUhhbmRsZXJ9IGZyb20gJy4vYXBpSGFuZGxlci5qcyc7XG5cbnZhciBtID0ge307XG5tLmRpc3BsYXkgPSBkaXNwbGF5O1xuXG5leHBvcnQge20gYXMgZGlzcGxheVJlc3BvbnNlUm93c307XG5cbnZhciB0aGVhZDtcbnZhciB0Ym9keTtcblxuZnVuY3Rpb24gZGlzcGxheShyb3dzKXtcbiAgdGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3BvbnNlVGFibGVIZWFkZXJcIik7XG4gIHRib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXNwb25zZVRhYmxlQm9keVwiKTtcbiAgdGJvZHkuaW5uZXJIVE1MID0gXCJcIlxuICB0aGVhZC5pbm5lckhUTUwgPSBcIlwiXG4gIGRpc3BsYXlIZWFkZXIocm93c1swXSlcbiAgZGlzcGxheVJvd1Mocm93cylcbn1cbmZ1bmN0aW9uIGRpc3BsYXlIZWFkZXIoaGVhZGVyUm93KXtcbiAgdmFyIHRoXG4gIHZhciBrZXlcbiAgZm9yKGtleSBpbiBoZWFkZXJSb3cpe1xuICAgIHRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRoXCIpO1xuICAgIHRoLmlubmVySFRNTCA9IGtleTtcbiAgICB0aGVhZC5hcHBlbmRDaGlsZCh0aClcbiAgfVxufVxuZnVuY3Rpb24gZGlzcGxheVJvd1Mocm93cyl7XG4gIHZhciByb3csdHJcbiAgdmFyIGlcbiAgZm9yKGk9MDsgaTxyb3dzLmxlbmd0aDsgaSsrKXtcbiAgICByb3cgPSByb3dzW2ldO1xuICAgIHRyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRyXCIpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzcG9uc2VUYWJsZUhlYWRlclwiKS5hcHBlbmRDaGlsZCh0cilcbiAgICBkaXNwbGF5Um93KHRyLHJvdylcbiAgfVxufVxuZnVuY3Rpb24gZGlzcGxheVJvdyh0cixyb3cpe1xuICB2YXIgdGQsa2V5LHZhbDtcbiAgZm9yKGtleSBpbiByb3cpe1xuICAgIHRkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRkXCIpO1xuICAgIHZhbCA9IHJvd1trZXldO1xuICAgIHRkLmlubmVySFRNTCA9IHZhbDtcbiAgICB0ci5hcHBlbmRDaGlsZCh0ZClcbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9jbGllbnQuanMuc3JjL2Rpc3BsYXlSZXNwb25zZVJvd3MuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXG52YXIgbSA9IHt9O1xuZXhwb3J0IHttIGFzIHF1ZXJ5TWFuYWdlcn07XG5cbm0uZm9yZWFjaCA9IGZvcmVhY2hcblxudmFyIGhvbGRlciA9IHtcblxuICBcImNvdW50IFRTTiBWaWRpIFdlYlwiOlxuICAgICAgYFNFTEVDVCBDT1VOVCgwKVxuICAgICAgRlJPTSBTU0QxXG4gICAgICBXSEVSRSBzZXNzaW9uX3RhZ3MgTElLRSAnJWMzLnBsYXllci5uYW1lPVRTTitWSURJK1dlYiUnXG4gICAgICBBTkQgIHN0YXJ0dGltZSA+PSAxNTE2MDQ3NjAwXG4gICAgICBBTkQgIHN0YXJ0dGltZSA8IDE1MTYwNDg1MDBcbiAgICAgIEFORCAgc3RhcnR1cHRpbWUgPSAtMTtgXG5cbiAgLFwibGlzdCBmcmlzdCAxMCByb3dzXCI6XG4gICAgICBgU0VMRUNUXG4gICAgICAqIEZST00gU1NEMVxuICAgICAgTElNSVQgNWBcblxufVxuZnVuY3Rpb24gZm9yZWFjaChmdW5jKXsgLy8obGJsLHF1ZXJ5KVxuICB2YXIga2V5O1xuICBmb3Ioa2V5IGluIGhvbGRlcil7XG4gICAgZnVuYyhrZXksaG9sZGVyW2tleV0pXG4gIH1cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vY2xpZW50LmpzLnNyYy9xdWVyeU1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy9odHRwczovL2NvbnZpdmEuYXBwLmJveC5jb20vZGV2ZWxvcGVycy9jb25zb2xlL2FwcC81MzY2OTgvY29uZmlndXJhdGlvblxuaW1wb3J0IHthcGlIYW5kbGVyIGFzIGFwaUhhbmRsZXJ9IGZyb20gJy4vYXBpSGFuZGxlci5qcyc7XG5cblxudmFyIG0gPSB7fTtcbmV4cG9ydCB7bSBhcyBib3hIYW5kbGVyfTtcblxuXG5tLmluaXQgPSBpbml0O1xuXG52YXIgYXV0aENvZGVcblxuLy9odHRwczovL2dpdGh1Yi5jb20vZ2l0aHViL2ZldGNoXG52YXIgYnRuX3RlbXBsYXRlXG5mdW5jdGlvbiBpbml0KCl7XG4gIC8vIGlmIGNhbGxlZCBmcm9tIGJveDpcbiAgLy8gaHR0cHM6Ly8xMjcuMC4wLjEvP2Zyb21fYm94PTEmc3RhdGU9c2VjdXJpdHlfdG9rZW5zOTAmY29kZT1ZMUxlMEZQUndaSFlmaFJQOGtUZmxWWUdMdHFpWHY2R1xuICBjb25zb2xlLmxvZygnYm94SGFuZGxlci5pbml0KCknKTtcbiAgY2hlY2tGb3JCb3hVc2VyVG9rZW4oKVxuICBvbldpbmRvd0xvYWQoZnVuY3Rpb24oKXtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bl9ib3hMb2dvblwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYm94TG9nb24pO1xuICB9KVxufVxuXG5cblxuZnVuY3Rpb24gY2hlY2tGb3JCb3hVc2VyVG9rZW4oKXtcbiAgLy9odHRwczovLzEyNy4wLjAuMS8/ZnJvbV9ib3g9MSZzdGF0ZT1zZWN1cml0eV90b2tlbnM5MCZjb2RlPVkxTGUwRlBSd1pIWWZoUlA4a1RmbFZZR0x0cWlYdjZHXG4gIHZhciB1cmkgPSBkb2N1bWVudC5sb2NhdGlvbi50b1N0cmluZygpO1xuICB2YXIgcGFyYW1zID0ge31cbiAgdXJpLnJlcGxhY2UoXG4gICAgbmV3IFJlZ0V4cChcIihbXj89Jl0rKSg9KFteJl0qKSk/XCIsIFwiZ1wiKSxcbiAgICBmdW5jdGlvbigkMCwgJDEsICQyLCAkMykgeyBwYXJhbXNbJDFdID0gJDM7IH1cbiAgKTtcbiAgYXV0aENvZGUgPSBwYXJhbXMuY29kZVxufVxuXG5mdW5jdGlvbiBib3hMb2dvbigpe1xuICBpZighYXV0aENvZGUpe1xuICAgIGdldEJveF9PQXV0aF9VUkwoKTtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGZvbGRlckxpc3RpbmcoKVxuXG59XG5cbmZ1bmN0aW9uIGZvbGRlckxpc3RpbmcoKXtcbiAgdmFyIGZvbGRlcklEID0gXCJcIlxuICBjYWxsKFwiZm9sZGVyTGlzdGluZ1wiLHtmb2xkZXJJRDpmb2xkZXJJRH0sZnVuY3Rpb24oc3VjY2VzcywgYXBpUmVzcG9uc2Upe1xuICAgIGlmKCBzdWNjZXNzICl7XG4gICAgICBvbkZvbGRlckxpc3RpbmcoYXBpUmVzcG9uc2UpXG4gICAgfVxuICAgIGVsc2V7XG4gICAgICBjb25zb2xlLmxvZyhcImZvbGRlckxpc3RpbmcgZXJyb3I6IFwiKyBKU09OLnN0cmluZ2lmeShvYmpSZXNwKSlcbiAgICB9XG4gIH0pXG59XG5cbmZ1bmN0aW9uIG9uRm9sZGVyTGlzdGluZyhhcGlSZXNwb25zZSl7XG4gIGRlYnVnZ2VyXG59XG5cbmZ1bmN0aW9uIGdldEJveF9PQXV0aF9VUkwoKXtcbiAgdmFyIHVzZXJuYW1lID0gbnVsbDtcbiAgY2FsbChcIk9BdXRoVXJsXCIse3VzZXJuYW1lOnVzZXJuYW1lfSxmdW5jdGlvbihzdWNjZXNzLCBhcGlSZXNwb25zZSl7XG4gICAgaWYoIHN1Y2Nlc3MgKXtcbiAgICAgIG9uX2JveF9PQXV0aF9VUkwoYXBpUmVzcG9uc2UudXJsKVxuICAgIH1cbiAgICBlbHNle1xuICAgICAgY29uc29sZS5sb2coXCJnZXRCb3hfT0F1dGhfVVJMIGVycm9yOiBcIisgSlNPTi5zdHJpbmdpZnkob2JqUmVzcCkpXG4gICAgfVxuICB9KVxufVxuXG5mdW5jdGlvbiBvbl9ib3hfT0F1dGhfVVJMKHVybCl7XG4gIGRlYnVnZ2VyXG4gIGRvY3VtZW50LmxvY2F0aW9uID0gdXJsXG59XG5cbmZ1bmN0aW9uIGNhbGwobWV0aG9kLHBhcmFtcyxjYWxsYmFjayl7XG4gIHBhcmFtcyA9IHBhcmFtcyB8fCB7fVxuICBwYXJhbXMuYXV0aENvZGUgPSBhdXRoQ29kZVxuICBwYXJhbXMubWV0aG9kID0gbWV0aG9kXG4gIGFwaUhhbmRsZXIuY2FsbCgnYm94JyxwYXJhbXMsZnVuY3Rpb24oc3VjY2Vzcywgb2JqUmVzcCl7XG4gICAgaWYoIHN1Y2Nlc3MgKXtcbiAgICAgIGNhbGxiYWNrKHRydWUsb2JqUmVzcC5hcGlSZXNwb25zZSlcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIGNhbGxiYWNrKGZhbHNlLG9ialJlc3ApXG4gICAgfVxuICB9KVxufVxuXG5mdW5jdGlvbiBvbldpbmRvd0xvYWQoZil7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgZigpO1xuICB9KTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vY2xpZW50LmpzLnNyYy9ib3hIYW5kbGVyLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=