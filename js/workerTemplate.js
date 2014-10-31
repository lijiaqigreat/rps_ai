/**
 * the worker must have `self.onmessage` that handles communication.
 * `e.data[0]` is the token to let the master recognize the return value
 * `e.data[1]` is the function name
 * `e.data.slice(1)` is the argument array
 * when recieving the message, the worker is responsible to do
 * `self.postMessage(e)` with `e.rtn` being the return value,
 * `e.token` being the token given at function call
 * The worker can return value asynchronously.
 * Throughout the worker's execution, worker is free to call
 * `self.postMessage(e)` with `e.log` being the log message that the worker want master to present.
 *
 * This file provides a simple synchronous implementation of worker.
 * It also provides some good practice for reference.
 */

var main=
{
  "debug":function(message){
    message="worker log: "+message+"\nwith this being "+this;
    self.postMessage({log:message});
  },
  "add":function(a,b){
    this.debug("adding "+a+"+"+b);
    return a+b;
  }
};
self.onmessage=function(e)
{
  var token=e.data[0];
  var name=e.data[1];
  var args=e.data.slice(2);
  var rtn=main[name].apply(main,args);
  self.postMessage({token:token,rtn:rtn});
};

