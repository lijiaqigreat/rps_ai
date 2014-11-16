
/**
 * It acts like bank.
 * It stores items and return a unique key to retreive the item
 * The key is unique across all token objects
 * You can delete item by calling `delete token[key]`
 * To remove all key, simply reconstruct a new Token()
 * @module js/tokens
 */
define([],function(){
  var nextKey=0;
  var proto={
    /**
     * @param {object} data the data to be stored
     * @return {Number} key to retrieve the data
     */
    store:function(data){
      var key=nextKey++;
      this[key]=data;
      return key;
    },
    /**
     * @param {function} forEach similar effect to array
     */
    forEach:function(call){
      for (var key in this) {
        if (this.hasOwnProperty(key)){
          call(this[key],Number(key),this);
        }
      }
    }
  };
  var f=function(){
  };
  f.prototype=proto;
  return f;
});
