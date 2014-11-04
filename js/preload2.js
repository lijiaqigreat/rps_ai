
//TODO determine url

var rpsd={};
var rps=$.extend((rps||{}),function(){
  var consts=//constant data
  {
    randomInt:function(n)
    {
      return Math.random()*n | 0;
    },
    abbr:["r","p","s"],
    result:["TIE","LOSE","WIN"],
    userParam:
    {
      boturi:"bots/markov.js",
      botparam:{
      },
      updateData:true,
      cache:true,
    },
    dataParam:
    {
      updateStrategy:"incremental",
      startStrategy:"bot",
    },
    url:
    {
      getData:"getData?",
      postData:"postData?",
      postGame:"postGame?"
    }
  };
  return {
    consts:consts,
    param: function()//changing data
    {
      //default
      var param=consts.defaultParam;
      //cookie
      var cookie;
      try{
        cookie=JSON.parse(Document.cookie);
      }catch(e){
        cookie={};
      }
      param=$.extend(param,cookie);
      //param = $.extend(param, JSON.parse(Document.cookie));
      //uri parameter
      param = $.extend(param,function(qs)
      {
        qs = qs.split("+").join(" ");
        var param = {};
        var re = /[?&]?([^=&]+)[=]?([^&]*)/g;
        var tokens = re.exec(qs);
        while (tokens) {
          param[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
          tokens = re.exec(qs);
        }
        return param;
      }(document.location.search));
      return param;
    }(),
    data:
    {
      data:null,
      botstr:null,
    },
    worker:
    {
      bot:null,
      promise:null,
      getWorker:function(str)
      {
        //server: update rps.bot, rps.
        // URL.createObjectURL
        window.URL = window.URL || window.webkitURL;
        var blob;
        try {
            blob = new Blob([str], {type: 'application/javascript'});
        } catch (e)  // Backwards-compatibility
        {
            window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
            blob = new BlobBuilder();
            blob.append(str);
            blob = blob.getBlob();
        }
        var worker = new Worker(URL.createObjectURL(blob));
        worker.onmessage=null;
        worker.onerror=null;
        return worker;
      },
       
      init:function(str)
      {
        this.stop();
        this.bot=this.getWorker(str);
        this.promise=Promise.resolve(null);
      },
      stop:function()
      {
        if(this.bot!==null){
          this.promise=null;
          this.bot.terminate();
          this.bot=null;
        }
      },
      call:function(input)
      {
        var self=this;
        var promise=this.promise;
        this.promise = promise.then(function(output)
        {
          return new Promise(function(a,b){
            self.bot.onmessage=function(e)
            {
              a(e.data); 
            };
            self.bot.onerror=function(e)
            {
              b(e.data); 
            };
            self.bot.postMessage(input);
          });
        });
        return this.promise;
      }
    },
    post_data:function(data,date)
    {
      return Promise.resolve($.post(
        this.consts.postData+$.param({
          bot:this.param.boturi,
          param:this.param.botparam,
          data:data,
          date:date
        })
      ));
    },
    /**
     * called when bot is ready to play
     */
    ready:function()
    {
      //TODO
    },
    /**
     * called when bot is not ready to play
     */
    ready_not:function()
    {
      //TODO
    },
    end_game:function()
    {
      this.ready_not();
      //post game
      if(history.turn.length!==0){
        $.post(this.consts.url.postGame+$.param(history));
      }
      this.worker.stop();
    },
    start_game:function()
    {
      var self=this;
      this.worker.init(this.data.botstr);
      return this.worker.call(//init bot
      {
        command:"init",
        param:{
          param:self.param.botparam,
          data:self.data.data
        }
      })
      .then(this.ready.bind(this));
    },
    restart:function()
    {
      //TODO
      start_game();
    },
    /**
     * load bot based on boturi,botparam
     * reset worker
     * @return promise
     */
    loadBot:function()
    {
      var self=this;
      self.worker.stop();
      return Promise.resolve($.ajax(//load bot
      {
        url:this.param.bot.uri,
        dataType:"script",
        cache:this.param.cache
      }))
      .then(function(str)//update bot
      {
        self.data.botstr=str;
        self.worker.init(str);
        return self.worker.call(//init
        {
          command:"getDataParam",
          param:self.param.botparam
        });
      })
      .then(function(data)//update worker.param
      {
        return $.extend({},self.consts.dataParam,data);
      })
      .then(function(data){
        return self.loadData(data);
      });
    },
    loadData:function(dataParam)//helper for loadBot
    {
      var self=this;
      return Promise.resolve($.ajax(//load data
      {
        url:self.consts.url.getData+$.param(
        {
          bot:this.param.bot.uri,
          param:JSON.stringify(this.server.botparam),
          updateData:self.param.updateData

        }),
        cache:this.param.cache,
        dataType:"json"
      }))
      .then(function(data)//process data in worker
      {
        if(self.param.updateData){
          var promise = self.worker.call(
          {
            command:"train",
            param:{
              botparam:this.param.botparam,
              data:data.data,
              games:data.games
            }
          });
          //post data
          promise.then(function(data)
          {
            var date=data.games[data.games.length-1];
            return self.post_data(data.data,date);
          });
          return promise;
        }else{
          return data.data;
        }
      })
      .then(function(data)//store data
      {
        self.data.data=data;
        return data;
      })
      .then(self.restart.bind(self));
    },
    history:
    {
      turn:[],
      time:[]
    },
    //--- ui ---
    //update view
    updateView:function()
    {
      var h01=this.history[this.history.length-1] | 0;
      var h0=h01%3;
      var h1=(h01/3)|0;
      //update result
      $("#gr_0").attr("src","asset/rps_"+this.consts.abbr[h0]+"0.jpg");
      $("#gr_1").attr("src","asset/rps_"+this.consts.abbr[h1]+"1.jpg");
      
      //update history
      React.renderComponent(new roundsR({list:this.history}),$("#gh_scroll")[0]);
      //update stat
      //TODO
      var count=[0,0,0];
      this.history.forEach(function(h01){
        var h0=h01%3;
        var h1=(h01/3)|0;
        count[(h1-h0+3)%3]++;
      });
      var sum=count[0]+count[1]+count[2];
      var getPersent=function(i){
        if(sum===0){
          return "???%";
        }else{
          return ((100*count[i]/sum+0.5)|0)+"%";
        }
      };
      var trs=$("#gis_table tbody").children();
      $(trs[0]).children().each(function(i){
        i=(i+2)%3;
        this.innerHTML=count[i]>99?"99+":count[i];
      });
      $(trs[1]).children().each(function(i){
        i=(i+2)%3;
        this.innerHTML=getPersent(i);
      });
    },
    choose:function(h0)
    {
      //update model
      var h1=this.bot.getHand();
      this.bot.update(h0,h1);
      this.history.push(h0+h1*3);
      this.updateView();
    },
    end:function()
    {
      //TODO
      //submit game
      //refresh
    },

  };

}());
