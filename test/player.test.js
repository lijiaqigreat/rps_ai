define(["jquery","../js/game.js","../js/player/template.js","../js/player/human.js"],
function($,Game,template,Human){
  ddescribe("player:human",function()
  {
    beforeEach(function(){
      this.N=20;
      this.hand1=Array(this.N);
      this.hand2=Array(this.N);
      for(var i=0;i<this.N;i++){
      }
    });
    it("basic",function(done){
      var p1={doms:Array(3)};
      var p2={doms:Array(3)};
      for(var i=0;i<3;i++){
        p1.doms[i]=$("<div></div>");
        p2.doms[i]=$("<div></div>");
      }
      var h1=Human(p1);
      var h2=Human(p2);
      var nth=function(){};
      var delay=0;
      var hand1=[];
      var hand2=[];
      var click=function(hand,doms){
        var h=(Math.random()*3)|0;
        hand.push(h);
        doms[h].onclick();
      };
      var start=function(){
        window.setTimeout(function(){
          click(hand1,p1.doms);
          click(hand2,p2.doms);
        },delay);
      };
      var end=function(message){
        var hand12=hand1.map(function(h1,i){
          return h1+hand2[i]*4;
        });
        console.log(hand12);
        expect(hand12).toEqual(game.history);
        done();
      };
      var game=Game(h1,h2,100,start,nth,nth,end,10);
    });
  });
});
