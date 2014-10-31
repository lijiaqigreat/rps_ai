var main=
{
  "delay":function(message){
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

