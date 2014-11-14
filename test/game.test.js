define(["../js/game.js","../js/player/template.js"],
function(Game,template){describe("game",function()
{
  it("basic",function(done){
    var p1=template(0);
    var p2=template(0);
    var nth=function(){};
    var n=10;
    var game;
    var end=function(){
      console.log(game.history);
      console.log(game.history2);
      expect(game.history.length).toBe(n);
      expect(game.state).toBe("stopped");
      Promise.all([
      p1.then(function(p){
        expect(p.stopped).toBe(true);
      }),
      p2.then(function(p){
        expect(p.stopped).toBe(true);
      })])
      .then(done);
    };
    game=Game(p1,p2,0,nth,nth,nth,end,n);
  });
  it("stop when slow",function(done){
    var p1=template(100);
    var p2=template(100);
    var nth=function(){};
    var game;
    var end=function(){
      expect(game.history.length).toBe(0);
      done();
    };
    game=Game(p1,p2,1,nth,nth,nth,end,10);
  });
  it("stop when asked",function(done){
    var p1=template(100);
    var p2=template(100);
    var nth=function(){};
    var game;
    var end=function(){
      expect(game.history.length).toBe(0);
      done();
    };
    game=Game(p1,p2,50,nth,nth,nth,end,10);
    game.terminate();
  });
});});
