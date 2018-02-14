var m = {};
export {m as apiHandler};

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
