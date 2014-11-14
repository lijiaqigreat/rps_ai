/*
 * p.then(a)
 * .then(a)
 * .then(a)
 * .then(a)
 * .then(a)

 * p.then(function(x){
     b(x)

 *   p.then(a)
 *
 * })
 */
define(['./worker.js','./tokens.js','Promise','jquery'],
function(){
  /**
   * time a promise and return -1 if time exceed.
   * Designed to wrap player.getHand
   * @param {Promise} promise to be timed starting from the call
   * @param {Long} period max time in millisecond to spend for the promise,
   * 0 means no time limit.
   * @param {function} finish callback at the end of the process
   * @return {Promise} either normal return or -1 (when time exceeds)
   */
  function getHandWrapper(promise,period,finish){
    if(period<=0){
      return promise;
    }
    return new Promise(function(a,b){//timeout
      promise.then(a);
      window.setTimeout(function(){b("time out");},period);
    }).catch(function(error){
      return -1;
    })
    .then(function(rtn){//update finish
      console.log("r"+rtn);
      finish();
      return rtn;
    });
  }
  /**
   * helper function to be used in beginning and routine rounds.
   * @see return function for meanings of the parameters
   */
  /**
   * @param {Promise} g1 first player
   * @param {Promise} g2 second player
   * @param {function} start to be called at the beginning of each round
   * @param {function} finish1 to be called when player1 finishes round
   * @param {function} finish2 same as finish1, but for player2
   * @param {function} end TODO explain
   * @return {object} representation of game state
   */
  return function(g1,g2,period,initial,start,finish1,finish2,end,n){
    var f={
      history:[],
      history2:[],
      time:0,
      terminate:undefined,
      end:end,
    };
    var p1,p2;
    var promise;
    var quit=function(message){
      console.log("quit");
      console.log(message.message);
      p1.stop();
      p2.stop();
      end();
      throw "";
    };
    //REALLY COMPLICATED
    var update=function (h0,h1,dt)
    {
      if(n--<=0){
        throw "no more turns";
      }

      start();
      return new Promise(function(a,b){
        f.terminate=b;
        Promise.all([
          getHandWrapper(p1.getHand(h0,h1,dt),period,finish1),
          getHandWrapper(p2.getHand(h1,h0,dt),period,finish2)
        ])
        .then(function(hs){
          if(hs[0]===-1&&hs[1]===-1){
            throw "no one finish";
          }
          return hs;
        }).then(a,b);
      });
    };
    var recur=function(hs){
      console.log("!");
      promise=promise.then(function(){
        f.history.append(hs[0]+hs[1]*4);
        var tmp=f.time;
        f.time=Date.now();
        tmp=f.time-tmp;
        f.history2.append(tmp);
        update(p1,p2,finish1,finish2,period,hs[0],hs[1],tmp,f)
        .then(recur);
      },quit);
    };
    initial();
    promise=new Promise(function(a,b){//stop loading
      f.terminate=b;
      Promise.all([g1,g2]).then(a);
    });
    promise.then(function(ps){return ps;},function(error){
      f.state="quit";
      //do nothing to quit initialization of player
    });
    //without catch error, do nothing when error
    promise=promise.then(function(ps){
      p1=ps[0];
      p2=ps[1];
      f.time=Date.now();
      return update(-1,-1,0);
    });

    /*
    promise.then(recur,quit)
    .catch(function(){
      f.state="quit";
    });
    */
    return f;
  };
});
