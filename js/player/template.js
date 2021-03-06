/**
 * This is a template for player.
 * It implement all api so that it plays randomly.
 * All method returns in async way (through Promise)
 * The creation of player requires custom code.
 */
define(['../worker.js','../tokens.js','Promise','jquery'],
function(Worker,Tokens,Promise,$){
  /**
   * construction of player is totally arbitrary.
   * we recommend putting as much code as possible to this player module,
   * while keeping player modulerized.
   * However, once player is constructed,
   * we require player to only have interface listed in this template.
   * The following this recommended arguments for player constructor.
   * The return is however fixed and the api for player is specified below.
   * @return {Promise} the player
   */
  return function(time){
    time|=0;
    return Promise.resolve(
    {
      /**
       * notify the player the last turn
       * and return new hand within game's time constraint
       * (usually infinite long)
       * @param {Hand} h0 bot's hand
       * @param {Hand} h1 opponent's hand
       * @param {Number} dt milliseconds since last turn
       * @return {Promise} next hand
       */
      getHand: function(h0,h1,dt)
      {
        return new Promise(function(a,b){
          window.setTimeout(function(){a((Math.random()*3)|0);},time);
        });
      },
      /**
       * @return {Promise} undefined when finished
       */
      stop: function()
      {
        this.stopped=true;
        return Promise.resolve();
      }
    });
  };
});
