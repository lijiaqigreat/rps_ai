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

define("Worker",["./tokens.js"],function(Tokens){

window.URL = window.URL || window.webkitURL;
window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;

var onmessageHelper=function (e)
{
  if(e.data.log){
    console.log(e.data.debug);
  }
  if(e.data.rtn){
    this.tokens[e.data.token].a(e.data.rtn);
    delete this.tokens[e.data.token];
  }
  if(e.data.error){
    this.tokens[e.data.token].b(e.data.error);
    delete this.tokens[e.data.token];
  }
};
var onerrorHelper=function (e)
{
  if(e.data.token){
    this.tokens[e.data.token].b(e.data.error);
    delete this.tokens[e.data.token];
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
  worker.onmessage=onmessageHelper.bind(this);
  worker.onerror=onerrorHelper.bind(this);
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
    if(obj instanceof string){
    }
    this.worker=getWorker.bind(this)(str);
  },
  stop:function()
  {
    if(this.worker!==null){
      this.worker.terminate();
      this.worker=null;
    }
  },
  call:function()
  {
    var args=arguments;
    var self=this;
    return new Promise(function(a,b){
      var token=self.tokens.store({a:a,b:b});
      self.worker.postMessage([token].concat(args));
    });
  }

};
var workergen=function()
{
  this.worker=null;
  this.tokens={};
  this.promise=Promise.resolve();
  this._onmessage=null;
  this._onerror=null;
};
workergen.prototype=proto;
return workergen;
});
