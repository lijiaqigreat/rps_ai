define(['Promise','jquery'],
function(Promise,$){
  /**
   * @param {DOM[3]} param.doms three buttuns wait to be clicked
   */
  return function(param){
    

    return Promise.resolve({
      getHand: function(h0,h1,dt){
        console.log("human1");
        console.log(param.doms);
        return new Promise(function(a,b){
          param.doms.forEach(function(e,i){
            console.log(e);
            e.onclick=function(){
              a(i);
            };
          });
        });
      },
      stop:function(){

      }
    });
  };

});
