/**
 * requirejs module template for player
 */
define(['Promise'],
function(Promise){
  /**
   * construct a new player that is returned by Promise
   * @param {DOM} element the element that player need to render
   * @param {Number} side 0 means right side, player 1.
   * 1 means left side, player 2.
   * @param {Object} param custom parameter for player
   * @param {Object} opponentid id of the opponent (md5 hash of param)
   * @return {Promise} player
   */
  return function(element,side,param,opponentid){
    return Promise.resolve(function(){//return
      return {
        /**
         * @return {Promise} next hand (0,1,2)
         */
        getHand:function()
        {
          return Promise.resolve((Math.random()*3)|0);
        },
        /**
         * notify the player the last turn
         * @param {Hand} h0 player's hand
         * @param {Hand} h1 opponent's hand
         * @param {Number} dt milliseconds since last turn
         * @return {Promise} null when it's done
         */
        update:function(h0,h1,dt)
        {
          return Promise.resolve(null);
        },
        /**
         * to be called before player destroyed
         * @return {none} null
         */
        stop:function()
        {
          
        }
      };
    });
  };
});
