define([],
function(){
  var PlayerError=function(message, data){
    this.message="PLAYER: "+message;
    this.data=data;
  };
  PlayerError.prototype=new Error();
  return PlayerError;
});
