/**
 * A template of RPS Robot.
 * All nessesary api are provided.
 * It will be loaded by Web Worker
 * @module botTemplate
 */

var bot={
  /**
   * make next move
   * 
   * @return {Hand} next hand
   */
  getHand:function(){
    return (Math.random()*3)|0;
  },
  /**
   * notify the bot the last turn
   * only will be called after initialized
   * @param {Hand} h0 bot's hand
   * @param {Hand} h1 opponent's hand
   * @param {Number} dt milliseconds since last turn
   * @return {none} undefined
   */
  update:function(h0,h1,dt)
  {
    return;
  },
  /**
   * method for retrieving dataParam
   * @static
   * @param {Object} param the parameter for bot (independent of method used)
   * @return {Object} data param TODO link api
   */
  getDataParam:function(param){
    return {};
  },
  /**
   * initialize bot
   * @param {Object} param the parameter for bot (independent of method used)
   * @param {Object} data used to initialize state of bot
   * @return {none} undefined
   */
  init:function(param,data){
    return;
  },
  /**
   * a static method used for training bot offline
   * @static
   * @param {Object} param the parameter for bot (independent of method used)
   * @param {Object} data the old used to initialize state of bot
   * @param {Array} games games used for bot to train TODO reference game api
   * @return {Object} new state of bot after training
   */
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
  var name=e.data[1];
  var args=e.data.slice(2);
  var rtn=bot[name].apply(bot,args);
  if(rtn===undefined){rtn="undefined";}
  self.postMessage({token:token,rtn:rtn});
};
