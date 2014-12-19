define(["jquery","./game.js","./player/human.js","./player/bot.js","./consts.js"],
function($,Game,Human,Bot,consts){
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
      return;
    }
    var h0=h01&3;
    var h1=(h01/4)&3;
    
    //$("#gr_0 > img").removeClass("gr_0i1").attr("src","asset/rps_"+consts.abbr[h0]+"0.jpg").addClass("gr_0i1");
    $("#gr_0 > img")
      .attr("src","asset/rps_"+consts.abbr[h0]+"0.jpg")
      .toggleClass("gr_0i0")
      .toggleClass("gr_0i1");
    $("#gr_1 > img")
      .attr("src","asset/rps_"+consts.abbr[h1]+"1.jpg")
      .toggleClass("gr_1i0")
      .toggleClass("gr_1i1");
    //update history
    $("#gh_scroll").prepend(
      $("#w_roundR").html()
        .replace(/p(?=(0\.jpg))/,consts.abbr[h0])
        .replace(/p(?=(1\.jpg))/,consts.abbr[h1])
        .replace(/TIE/,consts.result[(h1-h0+3)%3])
    );
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
    $("#gh_scroll").html("");
    global2=game;
    if(game.history.length!==0){
      return;
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
