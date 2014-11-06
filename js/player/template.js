define(['./worker.js','./tokens.js','Promise','jquery'],
function(Worker,Tokens,Promise,$){
  /**
   * @param {DOM} element the DOM that player uses to display
   * @param {Number} side 0 if on the left (player 1).
   * 1 if on the right (player 2).
   * @param {Object} param custom param for player
   * @param {MD5} opponentid MD5 hash of opponent param
   * @return {Promise} the player
   */
  return function(element,side,param,opponentid){
    return Promise.resolve(
    {
      /**
       * @return {Promise} next hand
       */
      getHand: function()
      {
        return Promise.resolve((Math.random()*3)|0);
      },
      /**
       * notify the bot the last turn
       * @param {Hand} h0 bot's hand
       * @param {Hand} h1 opponent's hand
       * @param {Number} dt milliseconds since last turn
       * @return {Promise} undefined
       */
      update: function(h0,h1,dt)
      {
        return Promise.resolve();
      },
      /**
       * @return {Promise} undefined
       */
      stop: function()
      {
        return Promise.resolve();
      }
    });
  };
});
