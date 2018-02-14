
// https://stackoverflow.com/questions/6156501/read-a-file-one-line-at-a-time-in-node-js
//https://techsparx.com/nodejs/howto/csv2mysql.html
const fs         = require('fs');
const readline = require('readline')
const path = require('path');

const dbhost = ""//process.argv[2];
const dbuser = "user1"//process.argv[3];
const dbpass = "oZANsbeB1nBlVBAx"//process.argv[4];
const dbname = "ssd-explorer"//process.argv[5];
const tblnm  = "ssd1"//process.argv[6];
const csvfn  = "../import_cache/Book1.csv"//process.argv[7];
module.exports = readCSV;

function readCSV(paramObj,callback){
  console.log("readCSV")

  var path = getImportCachePath() + '/Book1.csv'
  if(! fs.existsSync(path)){
    return callback(false,{message:"path doesn't exisit",path:path})
  }


  var lineReader = readline.createInterface({
    input: fs.createReadStream(path )
  });

  lineReader.on('line', function (line) {
    console.log('Line from file:', line);
    callback(true,{message:"sucess in getting line",line:line})
    return false
  });

}

function getImportCachePath(){
  var s = path.dirname(require.main.filename )
  s += "/../import_cache"
  s = path.normalize(s)
  //s = "/mnt/c/dev/SSDQuery/v.00.002.001/import_cache"
  console.log("getImportCachePath:"+ s)
  return s
}
