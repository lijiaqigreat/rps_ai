/**
 * requirejs module for bot player
 * It creates a Web Worker that encapsolates bot
 * @see {@link bot/template} for api of bot
 */
define(['../worker.js','../tokens.js','Promise','jquery','../../vendor/md5.js'],
function(Worker,Tokens,Promise,$,md5){
  /**
   * @param {String} param.boturi uri of the bot source 
   * @param {Object} param.botparam custom param for the bot
   * @param {String} param.dataurl url of the data used to get data
   * if it ends with '?' or '&' the player will append the attribute
   * with key being "hash" and value being the md5 of the string form of param
   */
  return function(param)
  {
    var worker=new Worker();
    return Promise.resolve($.ajax(//load bot
    {
      url:param.boturi
    }))
    .then(function(str)//get dataparam
    {
      worker.init(str);
    },function(error){console.log(error);throw error;})
    .then(function()
    {
      var uri=param.dataurl;
      var end=uri[uri.length-1];
      if(end==='?'||end==='&'){
        var hash=md5(JSON.stringify(param));//TODO build md5 convert webpage
        uri+="hash="+hash;
      }
      return Promise.resolve($.ajax(
      {
        url:uri,
        dataType:"json"
      }))
      .catch(function(error){
        //TODO report error
        return {};
      });
    })
    .then(function(data)//init bot
    {
      return worker.call("init",param.botparam,data);
    })
    .then(function(){//return
      return {
        getHand:function(h0,h1,dt)
        {
          return worker.call("update",h0,h1,dt).then(function(){
            return worker.call("getHand");
          });
        },
        stop:function()
        {
          //TODO
        }
      };
    });
  };
});
