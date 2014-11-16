/**
 * This provides a generic wrapper for web worker.
 * It allows async function call to the worker through Promise,
 * and allows worker to send back debug information,
 * return value, error message.
 * The worker can be stopped, reinitialized any time,
 * without constructing new Worker.
 *
 * @see {@link js/workerTemplate} for API of the worker
 * 
 * @module js/worker
 */

define(["./text_to_url.js","./tokens.js"],function(t2u,Tokens){

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
  var worker = new Worker(t2u(str,"text/javascript"));
  var self=this;
  worker.onmessage=function(e){return onmessageHelper(self,e);};
  worker.onerror=function(e){return onerrorHelper(self,e);};
  return worker;
};

var proto=
{
  /**
   * this stops the worker and restart a new one
   * @param {String} str the source code of the worker
   * @return {Promise} none, when finished initializing
   */
  init:function(str)
  {
    this.stop();
    this.worker=getWorker.call(this,str);
  },
  /**
   * instantly stop worker
   * @return undefined
   */
  stop:function()
  {
    if(this.worker!==null){
      var self=this;
      this.tokens.forEach(function(value,token){
        //console.log(self.tokens[token]);
        value.b("worker stopped");
      });
      this.tokens=new Tokens();
      this.worker.terminate();
      this.worker=null;
    }
  },
  /**
   * simulate calling an async method
   * @return {Promise} simulate async return
   */
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
};
workergen.prototype=proto;
return workergen;
});
