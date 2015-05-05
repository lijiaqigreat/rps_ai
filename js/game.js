/*
 * 0: state: initiating, game created
 * 1: player initiated, state: running, \
 * 2: game_start called > request p1,p2 result
 * 3: (both player return result) check result
 * 4: 
 */
define(['Promise'],
function(Promise){
  function debug(message){
    console.error(message.stack);
    throw message;
  }
  /**
   * time a promise and return 3 if time exceed.
   * Designed to wrap player.getHand
   * @param {Promise} promise to be timed starting from the call
   * @param {Long} period max time in millisecond to spend for the promise,
   * 0 means no time limit.
   * @param {function} finish callback at the end of the process
   * @return {Promise} either normal return or 3 (when time exceeds)
   */
  /**
   * list errors thrown:
   * no one finish
   * no more turns
   * (error thrown by player)
   * @param {Promise} g1 first player
   * @param {Promise} g2 second player
   * @param {function} start to be called at the beginning of each round.
   * `this` is the game
   * @param {function} finish1 to be called when player1 finishes round
   * @param {function} finish2 same as finish1, but for player2
   * @param {function} end 
   * `this` is the game
   * @return {object} representation of game state
   */
  return function(g1,g2,period,start,finish1,finish2,end,n)
  {
    var f=
    {
      player1:undefined,
      player2:undefined,
      history:[],
      history2:[],
      promise:undefined,
      time:0,
      terminate:undefined,
      state:"initiating"
    };
    f.terminate=function(message){
      console.debug("state: "+this.state);
      switch(this.state){
        case "initiating":
          
        break;
        case "running":
          this.player1.stop();
          this.player2.stop();
        break;
        case "stopped":
          console.debug("state: "+this.state);
          return;
      }
      this.state="stopped";
      end.call(this,message);
    };
    var getHandWrapper=function(promise,period,finish)
    {
      if(period<=0){
        return promise;
      }
      return new Promise(function(a,b){//timeout
        promise.then(a);
        window.setTimeout(function(){b("time out");},period);
      }).catch(function(error){
        return 3;
      })
      .then(function(rtn){//update finish
        if(f.state=="stopped"){
          return;
        }
        finish();
        return rtn;
      });
    };
    //REALLY COMPLICATED
    var update=function (h0,h1,dt)
    {
      if(n--===-1){
        f.terminate("no more turns");
        return;
        //return Promise.reject("no more turns");
      }

      start.call(f);
      return Promise.all(
      [
        getHandWrapper.call(this,f.player1.getHand(h0,h1,dt),period,finish1),
        getHandWrapper.call(this,f.player2.getHand(h1,h0,dt),period,finish2)
      ])
      .then(function(hs)
      {
        if(f.state=="stopped"){
          return;
        }
        if(hs[0]===3||hs[1]===3){
          f.terminate("no one finish");
          return;
        }
        var tmp=f.time;
        f.time=Date.now();
        tmp=f.time-tmp;
        tmp=Math.log(tmp/64,1.5)|0;//IMPORTANT
        if(tmp>15){tmp=15;}
        if(tmp<0){tmp=0;}
        f.history.push((hs[0]&3)+(hs[1]&3)*4+tmp*16);
        f.promise=update(hs[0],hs[1],tmp);
        return;
      })
      //.catch(debug)
      .catch(function(message){
        f.terminate(message); 
      });
    };
    f.promise=Promise.all([g1,g2])
    .then(function(ps)
    {//without catch error, do nothing when error
      if(f.state==="stopped"){
        return;
      }
      f.player1=ps[0];
      f.player2=ps[1];
      f.time=Date.now();
      f.state="running";
      return update(3,3,0);
    })
    //.catch(debug)
    .catch(function(message){
      f.terminate(message); 
    });
    return f;
  };
});
