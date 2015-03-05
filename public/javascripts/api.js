function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    function ajaxRequest(){
     var activexmodes=["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"] //activeX versions to check for in IE
     if (window.ActiveXObject){ //Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
      for (var i=0; i<activexmodes.length; i++){
       try{
        return new ActiveXObject(activexmodes[i])
       }
       catch(e){
        //suppress error
       }
      }
     }
     else if (window.XMLHttpRequest) // if Mozilla, Safari etc
      return new XMLHttpRequest()
     else
      return false
    }
    var mypostrequest = new ajaxRequest()
    mypostrequest.onreadystatechange = function(){
     if (mypostrequest.readyState == 4){
      if (mypostrequest.status == 200 || window.location.href.indexOf("http") == -1){
       console.log(mypostrequest.responseText);
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
    mypostrequest.open(method, path, true);
    mypostrequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    mypostrequest.send(parameters);
}