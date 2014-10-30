/**
 * This provides a generic wrapper for web worker.
 * It allows function call, debug
 * @module js/worker
 */
window.URL = window.URL || window.webkitURL;
window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
var header="var exports={};var module={exports:exports,self:self};";
var footer="(module.self.onmessage=function(e){module.exports[e.data[0]].apply(null,e.data.slice(1));};)";

var onmessageHelper=function (e)
{
  if(e.data.debug){
    console.debug(e.data.debug);
  }
  if(e.data.rtn){
    this._onmessage(e.data.rtn);
  }
  if(e.data.error){
    this._onerror(e.data.error);
  }
};
var onerrorHelper=function (e)
{
  this.onerror(e.data);
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
   * this interrupts the worker and 
   * @param {string} str js source of the worker. See {@link bots/template} to get api of the bot
   * @return promise
   */
  init:function(str)
  {
    this.stop();
    this.worker=getWorker.bind(this)(str);
    this.promise=Promise.resolve(null);
  },
  stop:function()
  {
    if(this.worker!==null){
      this.promise=null;
      this.worker.terminate();
      this.worker=null;
    }
  },
  call:function()
  {
    
    var self=this;
    var promise=this.promise;
    this.promise = promise.then(function(output)
    {
      return new Promise(function(a,b){
        self._onmessage=a;
        self._onerror=b;
        self.worker.postMessage(arguments);
      });
    });
    return this.promise;
  }
};
var workergen=function()
{
  this.worker=null;
  this.promise=Promise.resolve();
  this._onmessage=null;
  this._onerror=null;
};
workergen.prototype=proto;
module.exports=workergen;
