define(['Promise'],
function(Promise){
  /**
   * @param {DOM[3]} param.doms three buttuns wait to be clicked
   */
  return function(param){
    console.debug("passed");
    var nth=function(){};
    //called at click
    var callback={test:"debug",a:nth};
    var handlers=Array(3);
    param.doms.forEach(function(e,i){
      handlers[i]=function(){
        callback.a(i);
        callback.a=nth;
      };
      $(e).on("click",handlers[i]);
    });
    

    return Promise.resolve({
      getHand: function(h0,h1,dt){
        var self=this;
        return new Promise(function(a,b){
          callback.a=a;
        });
      },
      stop:function(){
        var self=this;
        param.doms.forEach(function(e,i){
          $(e).off("click",handlers[i]);
        });
      }
    });
  };

});
