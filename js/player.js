define(['./worker.js','./tokens.js','Promise','jquery'],
function(Worker,Tokens,Promise,$){
  var player=function(element,side,param){
    var worker=new Worker();
    return Promise.resolve($.ajax(//load bot
    {
      url:param.boturi,
      dataType:"script",
      cache:param.cache
    }))
    .then(function(str)//get dataparam
    {
      worker.init(str);
      return worker.call("getDataParam",param.botparam);
    })
    .then(function(dataparam)//load data
    {
      return Promise.resolve($.ajax(
      {
        url:datastoreurl,
        data:
        {
          bot:param.boturi,
          param:param.botparam,
          updateData:param.updateData
        },
        cache:param.cache,
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
  return player;
});
