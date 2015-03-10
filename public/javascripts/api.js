function post(path, params, method) {
  method = method || "post"; // Set method to post by default if not specified.
  function ajaxRequest(){
   var activexmodes=["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"] //activeX versions to check for in IE
    if (window.ActiveXObject){ //Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
      for (var i=0; i<activexmodes.length; i++){
        try{ return new ActiveXObject(activexmodes[i]); }
        catch(e){ /* suppress error */ }
      }
    }
    else if (window.XMLHttpRequest) {// if Mozilla, Safari etc
      return new XMLHttpRequest();
    } else {
      return false;
    }
  }
  var request = new ajaxRequest()
  request.onreadystatechange = function(){
   if (request.readyState == 4){
    if (request.status == 200 || window.location.href.indexOf("http") == -1){
     console.log(request.responseText);
    }
    else{
     //error
    }
   }
  }
  var parameters = "";
  for(var key in params) {
    if(params.hasOwnProperty(key)) {
      parameters += key + "=" + encodeURIComponent(params[key]) + "&";
    }
  }
  parameters = parameters.substring(0, parameters.length - 1);
  request.open(method, path, true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send(parameters);
}

function get(url, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onload = function() {
    callback(this.responseText);
  };
  xmlHttp.open( "GET", url, false );
  xmlHttp.send( null );
}

function parse(val) {
  var result = "Not found",
      tmp = [];
  location.search
  .substr(1)
  .split("&")
  .forEach(function (item) {
    tmp = item.split("=");
    if (tmp[0] === val) result = decodeURIComponent(tmp[1]);
  });
  return result;
}