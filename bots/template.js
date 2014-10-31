/**
 * A template of RPS Robot.
 * All nessesary api are provided.
 * It will be loaded by 
 * @module bots/template
 */

var running=false;
var bot={
  getHand:function(){
    if(!running){
      throw "not initialied yet";
    }
    return (Math.random()*3)|0;
  },
  update:function(h0,h1,dt)
  {
    if(!running){
      throw "not initialied yet";
    }
    return;
  },
  get_dataparam:function(param){
    return {};
  },
  init:function(param,data){
    running=true;
    return;
  },
  train:function(param,data,games){
    return data;
  },
};
/**
 * There have to be a self.onmessage that handles all function calls
 * 
 * 
 * @param e {object} e.data[0] is the name of the function,
 * e.data.slice(1) is the argument array for the function call
 */
self.onmessage=function(e){
  var command=e.data[0];
  var args=e.data.slice(1);
  var rtn=bot[command].apply(bot,args);
  self.postMessage({rtn:rtn});
};
