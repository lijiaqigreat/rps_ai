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
   * @param {Boolean} param.updateData true if the bot trains the data and send new data to server
   * @param {Boolean} param.datastoreurl url of the datastore used to get and post data
   */
  return function(element,side,param,opponentid)
  {
    var id=md5(JSON.stringify(param));
    var worker=new Worker();
    return Promise.resolve($.ajax(//load bot
    {
      url:param.boturi,
      dataType:"script",
    }))
    .then(function(str)//get dataparam
    {
      worker.init(str);
    })
    .then(function()
    {
      if(!param.updateData){
        return {};
      }else{
        return worker.call("getDataParam",param.botparam)
        .then(function(dataparam)//load
        {
          return Promise.resolve($.ajax(
          {
            url:param.datastoreurl,
            data:
            {
              id1:id,
              id2:opponentid,
              bot:param.boturi,
              param:param.botparam,
              //TODO human
            },
            dataType:"json"
          }));
        })
        .then(function(data)//process data
        {
          if(self.param.updateData){
            var date=data.games[data.games-1].date;
            worker.call("train",botparam,data.data,data.games)
            .then(function(data){
              return Promise.resolve($.post(param.datastoreurl,{
                bot:param.boturi,
                param:param.botparam,
                date:date,
                data:data
              }));
            });
          }
          return data.data;
        });
      }
    })
    .then(function(data)//init bot
    {
      return worker.call("init",param.botparam,data.data);
    })
    .then(function(){//return
      return {
        getHand:function()
        {
          return worker.call("getHand");
        },
        update:function(h0,h1,dt)
        {
          return worker.call("update",h0,h1,dt);
        },
        stop:function()
        {

        }
      };
    });
  };
});
