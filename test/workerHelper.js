/*
function add(a,b){
  return a+b;
}
self.onmessage=function(e)
{
  var token=e.data[0];
  var name=e.data[1];
  var args=e.data.slice(2);
  if(name==="delay"){
    var time=args[0];
    var message=args[1];
    setTimeout(function(){
      self.postMessage({log:"delay: "+message});
      self.postMessage({token:token,rtn:message});
    },time);
  }
  if(name==="add"){
    var rtn=add.apply(null,args);
    self.postMessage({token:token,rtn:rtn});
  }
};
*/
define([],function(){
  return "function add(a,b){\r\n  return a+b;\r\n}\r\nself.onmessage=function(e)\r\n{\r\n  var token=e.data[0];\r\n  var name=e.data[1];\r\n  var args=e.data.slice(2);\r\n  if(name===\"delay\"){\r\n    var time=args[0];\r\n    var message=args[1];\r\n    setTimeout(function(){\r\n      self.postMessage({log:\"delay: \"+message});\r\n      self.postMessage({token:token,rtn:message});\r\n    },time);\r\n  }\r\n  if(name===\"add\"){\r\n    var rtn=add.apply(null,args);\r\n    self.postMessage({token:token,rtn:rtn});\r\n  }\r\n};";
});

