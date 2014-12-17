define(["jquery","./game.js","./player/human.js","./player/bot.js","./consts.js"],
function($,Game,Human,Bot,consts){
  var roundR=React.createClass(
  {
    render: function (){
      return React.DOM.div(
        {className: "roundR"},
        React.DOM.div({className: "roundRc"},
          React.DOM.img({src:"asset/rps_"+consts.abbr[this.props.h0]+"0.jpg"})
        ),
        React.DOM.div({className: "roundRc"},consts.result[(this.props.h1-this.props.h0+3)%3]),
        React.DOM.div({className: "roundRc"},
          React.DOM.img({src:"asset/rps_"+consts.abbr[this.props.h1]+"1.jpg"})
        )
      );
    }
  });
  var roundsR=React.createClass(
  {
    render: function (){
      var list=this.props.list.map(function(h01){
        return new roundR({h0:h01&3,h1:(h01/4)&3});
      }).reverse();
      return React.DOM.div({},list);
    }
  });
  var getParam=function(){
    return {
      boturi:$("#ga_source").val(),
      dataurl:$("#ga_data").val(),
      botparam:$("#ga_param").val()
    };
  };
  var game;
  var param;
  var hands=$("#g_hand > div").toArray();
  var start=function()
  {
    global=game;
    var h01=game.history[game.history.length-1];
    if(h01===undefined){
      h01=15;
    }
    var h0=h01&3;
    var h1=(h01/4)&3;
    $("#gr_0").attr("src","asset/rps_"+consts.abbr[h0]+"0.jpg");
    $("#gr_1").attr("src","asset/rps_"+consts.abbr[h1]+"1.jpg");

    //update history
    React.renderComponent(new roundsR({list:game.history}),$("#gh_scroll")[0]);
    //update stat
    //TODO
    var count=[0,0,0];
    game.history.forEach(function(h01){
      var h0=h01&3;
      var h1=(h01/4)&3;
      var win=(h1-h0+3)%3;
      if(h0===3){
        win=1;
      }
      if(h1===3){
        win=2;
      }
      count[win]++;
    });
    var sum=count[0]+count[1]+count[2];
    var getPersent=function(i){
      if(sum===0){
        return "0%";
      }else{
        return ((100*count[i]/sum+0.5)|0)+"%";
      }
    };
    var trs=$("#gs_table tbody").children();
    $(trs[0]).children().each(function(i){
      i=(i+2)%3;
      this.innerHTML=count[i]>99?"99+":count[i];
    });
    $(trs[1]).children().each(function(i){
      //change order for gui
      i=(i+2)%3;
      this.innerHTML=getPersent(i);
    });
  };
  var nth=function(){};
  var end=function()
  {

    console.log("end!!!");
    console.log(game.history);
    global2=game;
    if(game.history.length!==0){
      var hist=btoa(String.fromCharCode.apply(null,game.history));
      
      var name=$("#gc_name").val();
      if(name===""){
        name="anonymous";
      }
      var hash=JSON.stringify(getParam());
      var ip="http://54.69.127.139";
      var data=JSON.stringify({hash:hash,name:name,hist:hist});
      console.log(data);
      $.ajax({
        type: "POST",
        url: ip,
        data: data,
        success: function(){
        },
        error:function(err){
          console.error(err);
        }
      });
    }
    var p1=Human({doms:hands});
    var p2=Bot(param);
    game=Game(p1,p2,0,start,nth,nth,end,50);
  };
  var globalLock=false;
  var resetGame=function()
  {
    console.log("game reset");
    if(globalLock===true){
      return;
    }
    if(game!==undefined){
      //STOP
      glabolLock=true;
      game.terminate();
      globalLock=false;
    }
  };
  var startGame=function(){
    param=getParam();
    var p1=Human({doms:hands});
    var p2=Bot(param);
    game=Game(p1,p2,0,start,nth,nth,end,50);
  };
  $.get("js/botList.json",function(data){
    var domlist=$("#gc_choose > ul > li");
    console.log(data);
    var datalist=data.bots;
    console.log(datalist);
    var clickhelper=function(){
      $("#ga_source").val(this.dataset.boturi);
      $("#ga_data").val(this.dataset.dataurl);
      $("#ga_param").val(this.dataset.botparam);
      resetGame();
    };
    domlist.each(function(i,e){
      $(e).on("click",clickhelper);
    });
    domlist[0].click();
    startGame();
    $("#gc_restart").on("click",resetGame);
    $("#ga_submit").on("click",resetGame);
  });
  window.onbeforeunload=function(){
    game.terminate();
    return "The game will be uploaded to the server. Thank you for the support!";
  };
  

});
