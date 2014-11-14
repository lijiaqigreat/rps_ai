define(["../js/game.js","../js/player/template.js"],
function(Game,template){describe("game",function()
{
  it("basic",function(done){
    var p1=template();
    var p2=template();
    var nth=function(){};
    var n=10;
    var game;
    var end=function(){
      //expect(game.history.length).toBe(n);
      done();
    };
    game=Game(p1,p2,10000,nth,nth,nth,nth,end,n);
    done();
    
  });
});});
