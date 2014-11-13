define(['Promise','jquery','../../vendor/md5.js'],
function(Promise,$,md5){
  /**
   * @param {DOM[3]} param.doms three buttuns wait to be clicked
   */
  return function(element,side,param){
    

    return {
      getHand: function(){
        return Promise(function(a,b){
          param.doms.forEach(function(e,i){
            e.onclick=function(){
              a(i);
            };
          });
        });
      },
      update:function(h0,h1,dt){
        
      },
      stop:function(){

      }
    };
  };

});
