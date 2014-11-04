/**
 * A template of RPS Robot.
 * All nessesary api are provided.
 * It will be loaded by 
 * @module bots/template
 */

var running=false;
var bot={
  /**
   * @return {Hand} next hand
   */
  getHand:function(){
    if(!running){
      throw "not initialied yet";
    }
    return (Math.random()*3)|0;
  },
  /**
   * notify the bot the last turn
   * @param {Hand} h0 bot's hand
   * @param {Hand} h1 opponent's hand
   * @param {Number} dt milliseconds since last turn
   * @return {Promise} null
   */
  update:function(h0,h1,dt)
  {
    if(!running){
      throw "not initialied yet";
    }
    return;
  },
  /**
   * @param {Object} param the parameter for bot (independent of method used)
   * @return {Object} data param
   */
  getDataParam:function(param){
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
 * @param {Number} e.data[0] token used for return
 * @param {Number} e.data[1] name of function to call
 * @param {Array} e.data.slice(2) argument list of function call
 */
self.onmessage=function(e){
  var token=e.data[0];
  var name=e.data[0];
  var args=e.data.slice(2);
  var rtn=bot[name].apply(bot,args);
  self.postMessage({token:token,rtn:rtn});
};
