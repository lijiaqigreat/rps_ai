/**
 * This provides a generic wrapper for web worker.
 * It allows async function call to the worker,
 * and allows worker to send back debug information,
 * return value, error message.
 *
 * @see {@link js/workerTemplate} for API of the worker
 * 
 * @module js/worker
 */

define(["./tokens.js"],function(Tokens){

window.URL = window.URL || window.webkitURL;
window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;

var onmessageHelper=function (self,e)
{
  if(e.data.log){
    console.log(e.data.log);
  }
  if(e.data.hasOwnProperty("rtn")){
    self.tokens[e.data.token].a(e.data.rtn);
    delete self.tokens[e.data.token];
  }
  if(e.data.error){
    self.tokens[e.data.token].b(e.data.error);
    delete self.tokens[e.data.token];
  }
};
var onerrorHelper=function (self,e)
{
  //TODO handle
  console.error(e);
  if(e.data.token){
    self.tokens[e.data.token].b(e.data.error);
    delete self.tokens[e.data.token];
  }else{
    
  }
};
var getWorker=function (str)
{
  // URL.createObjectURL
  //window.URL = window.URL || window.webkitURL;
  var blob;
  try {
      blob = new Blob([str], {type: 'application/javascript'});
  } catch (e)  // Backwards-compatibility
  {
      //window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
      blob = new BlobBuilder();
      blob.append(str);
      blob = blob.getBlob();
  }
  var worker = new Worker(URL.createObjectURL(blob));
  var self=this;
  worker.onmessage=function(e){return onmessageHelper(self,e);};
  worker.onerror=function(e){return onerrorHelper(self,e);};
  return worker;
};

var proto=
{
  /**
   * source, url, 
   * this stops the worker and restart a new one
   * @return promise
   */
  init:function(obj)
  {
    this.stop();
    if(obj instanceof String){
    }
    this.worker=getWorker.call(this,obj);
  },
  stop:function()
  {
    if(this.worker!==null){
      var self=this;
      this.tokens.all(function(token){
        //console.log(self.tokens[token]);
        self.tokens[token].b("worker stopped");
      });
      this.tokens=new Tokens();
      this.worker.terminate();
      this.worker=null;
    }
  },
  call:function()
  {
    var args=arguments;
    var self=this;
    var list=Array(args.length+1);
    for(var t=0;t<args.length;t++){
      list[t+1]=args[t];
    }
    return new Promise(function(a,b){
      var token=self.tokens.store({a:a,b:b});
      list[0]=token;
      self.worker.postMessage(list);
    });
  }

};
var workergen=function()
{
  this.worker=null;
  this.tokens=new Tokens();
  this.promise=Promise.resolve();
  this._onmessage=null;
  this._onerror=null;
};
workergen.prototype=proto;
return workergen;
});
