/**
 * A template of RPS Robot.
 * All nessesary api are provided.
 * It will be loaded by 
 * @module bots/template
 */
module.exports={
  running:false,
  getHand:function(){
    if(!this.running){
      throw "not initialied yet";
    }
    return (Math.random()*3)|0;
  },
  update:function(h0,h1,dt)
  {
    if(!this.running){
      throw "not initialied yet";
    }
    return;
  },
  get_dataparam:function(param){
    return {};
  },
  init:function(param,data){
    this.running=true;
    return;
  },
  train:function(param,data,games){
    return data;
  },
};
