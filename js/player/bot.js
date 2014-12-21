/**
 * requirejs module for bot player
 * It creates a Web Worker that encapsolates bot
 * @see {@link bot/template} for api of bot
 */
define(['../PlayerError.js','../worker.js','../tokens.js','Promise','jquery'],
function(PlayerError,Worker,Tokens,Promise,$){
  var BotError=function(message,error){
    PlayerError.call(this,message,error);
  };
  BotError.prototype=new PlayerError();
  /**
   * list of errors that will be throwed:
   * bot player: cannot load source from uri: (uri)
   * bot player: cannot understand source format from uri
   * bot player: cannot parse source: (message)
   * bot player: cannot load data from url: (url)
   * (error thrown by bot)
   * @param {String} param.boturi uri of the bot source 
   * @param {Object} param.botparam custom param for the bot
   * @param {String} param.dataurl url of the data used to get data
   * If it ends with '?' or '&' the player will append the attribute
   * with key being "hash" and value being the md5 of the string form of param.
   * If it is empty string, then data will be undefined
   */
  var init = function(param)
  {
    var worker=new Worker();
    var workerCall=function(){
      var args=arguments;
      return worker.call.apply(worker,args)
      .catch(function(error){
        throw new BotError("At calling worker."+args[0]+":"+error.message,error);
      });
    };
    return Promise.resolve($.ajax({
      url:param.boturi
    }))
    .catch(function(error){
      var botError=new BotError("Cannot load bot source from uri. message: "+error.statusText+".", error);
      throw botError;
    })
    .then(function(str)//get dataparam
    {
      try{
        if(param.boturi.indexOf("api.github.com/repos")!==-1){
          str=atob(str.content.replace(/\n/g,""));
          //console.log(str);
        }
      }catch(error){
        throw new BotError("Cannot read bot source from github",error);
      }
      try{
        worker.init(str);
      }catch(error){
        throw new BotError("Cannot parse bot source, message: "+error.message,error);
      }
    })
    .then(function()
    {
      var uri=param.dataurl;
      try{
        if(uri===""){
          return undefined;
        }
        var end=uri[uri.length-1];
        if(end==='?'||end==='&'){
          var hash=JSON.stringify(param);
          uri+="hash="+hash;
        }
      }catch(error){
        throw new BotError("Cannot general data uri. message: error",error);
      }
      return Promise.resolve($.ajax(
      {
        url:uri,
        dataType:"json"
      }))
      .catch(function(error){
        console.warn("Error loading bot data");
        //console.warn(error);
        console.warn("Using undefined as data");
        return undefined;
      });
    })
    .then(function(data)//init bot
    {
      return workerCall("init",param.botparam,data)
      .catch(function(error){
        throw new BotError("Cannot init bot.",error);
      });
    })
    .then(function(){//return
      return {
        getHand:function(h0,h1,dt)
        {
          return workerCall("update",h0,h1,dt).then(function(){
            return workerCall("getHand");
          });
        },
        stop:function()
        {
          worker.stop();
        }
      };
    });
  };
  return init;
});
