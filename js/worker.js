var promise=require("./promise");
var _=require("./underscore");

window.URL = window.URL || window.webkitURL;
window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;

function onmessageHelper(e)
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
}
function onerrorHelper(e)
{
  this.onerror(e.data);
}
function getWorker(str)
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
}

var proto=
{
   
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
  
  
module.exports=function()
{
  var f={
    worker:null,
    promise:Promise.resolve(),
    _onmessage:null,
    _onerror:null,
    
  };
  f.prototype=proto;
};
