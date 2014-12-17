define(['Promise','jquery'],
function(Promise,$){
  /**
   * @param {DOM[3]} param.doms three buttuns wait to be clicked
   */
  return function(param){
    

    return Promise.resolve({
      getHand: function(h0,h1,dt){
        return new Promise(function(a,b){
          param.doms.forEach(function(e,i){
            $(e).click(function(){
              a(i);
            });
          });
        });
      },
      stop:function(){

      }
    });
  };

});
