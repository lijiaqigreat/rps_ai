
/**
 * generates
 * @module js/tokens
 */
define([],function(){
  var nextKey=0;
  var proto={
    store:function(data){
      var key=nextKey++;
      this[key]=data;
      return key;
    },
    all:function(call){
      for (var key in this) {
        if (this.hasOwnProperty(key)){
          call(Number(key),this[key]);
        }
      }
    }
  };
  var f=function(){
  };
  f.prototype=proto;
  return f;
});
