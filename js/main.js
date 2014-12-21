define(["jquery","./game.js","./player/human.js","./player/bot.js","./consts.js"],
function($,Game,Human,Bot,consts){
  //define helper
  var getParam=function()
  {
    return {
      boturi:$("#wa_source").val(),
      dataurl:$("#wa_data").val(),
      botparam:$("#wa_param").val()
    };
  };
  var getName=function()
  {
    return $("#g_name").text();
  };
  var updateStat=function(count)
  {
    var sum=count[0]+count[1]+count[2];
    var getPersent=function(i){
      if(sum===0){
        return (100/3)+"%";
      }else{
        return ((100*count[i]/sum+0.5)|0)+"%";
      }
    };
    $("#s_bar > div").each(function(i){
      i=(i+2)%3;
      $(this).css("width",getPersent(i));
    });
    $("#s_text > span").each(function(i){
      if(i===0){
        this.innerHTML=sum;
        return;
      }
      //change order for gui
      i=(i-1+2)%3;
      this.innerHTML=count[i];
    });
  };
  var updateResult=function(h0,h1){
    $("#gr_0 > img")
      .attr("src","asset/rps_"+consts.abbr[h0]+"0.jpg")
      .toggleClass("gr_0i0")
      .toggleClass("gr_0i1");
    $("#gr_1 > img")
      .attr("src","asset/rps_"+consts.abbr[h1]+"1.jpg")
      .toggleClass("gr_1i0")
      .toggleClass("gr_1i1");
  };
  var setBottext=function(win){
    var array=consts.bottext[win];
    $("#g_bottext").text(array[consts.randomInt(array.length)]);
  };
  global=setBottext;

  //define game
  var game;
  var param;
  var game_start=function()
  {
    //global=game;
    var h01=game.history[game.history.length-1];
    if(h01===undefined){
      h01=15;
      return;
    }
    var h0=h01&3;
    var h1=(h01/4)&3;
    
    //update result
    updateResult(h0,h1);

    //update history
    $("#rh_tbody").prepend(
      $("#w_roundR").html()
        .replace("td>1</td","td>"+game.history.length+"</td")
        .replace(/x(?=(0\.jpg))/,consts.abbr[h0])
        .replace(/x(?=(1\.jpg))/,consts.abbr[h1])
        .replace(/TIE/,consts.result[(h1-h0+3)%3])
    );

    //update stat
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
    updateStat(count);

    //update bot
    var win=(h1-h0+3)%3;
    setBottext(win);
    //TODO
  };
  var nth=function(){};
  var game_end=function(message)
  {
    console.log("end!!!");
    //update bot
    if(message instanceof Error){
      setBottext(3);
    }else{
      $("#g_bottext").text("Game ended. Happy to play with you again!");

    }

    //global=game;
    if((game.history.length!==0)&&false){//debug
      //submit game
      var hist=btoa(String.fromCharCode.apply(null,game.history));
      var name=getName();
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
  };
  var startGame=function()
  {

    $("#g_bottext").text("I'm ready to play!");

    $("#rh_tbody").html("");
    if(game!==undefined){
      updateResult(3,3);
    }
    updateStat([0,0,0]);
    param=getParam();
    var hands=$("#g_hand > div").toArray();
    var p1=Human({doms:hands});
    var p2=Bot(param);
    game=Game(p1,p2,0,game_start,nth,nth,game_end,50);
  };
  var resetGame=function()
  {
    if(game!==undefined){
      //STOP
      game.terminate();
    }
    startGame();
  };

  //setup button
  $("#wh_submit").on("click",function()
  {
    var name=$("#wh_name").val();
    $("#g_name").text(name);
  });
  $("#c_restart").on("click",function(){resetGame();return false;});
  
  //setup botList
  $.getJSON("js/botList.json",function(data)
  {
    var html=$("#wb_list").html();
    var list=$("#wb_list").empty();
    var clickhelper=function(){
      
      list.children().removeClass("active");
      var param=$(this).addClass("active").data("param");
      console.log(param);
      $("#wa_source").val(param.param.boturi);
      $("#wa_data").val(param.param.dataurl);
      $("#wa_param").val(param.param.botparam);
      $("#g_botname").text(param.name);
      resetGame();
    };
    data.bots.forEach(function(e){
      console.log(e);
      var newE=$(html
        .replace("${name}",e.name)
        .replace("${description}",e.description))
      .data("param",e)
      .on("click",clickhelper);
      list.append(newE);
    });
    list.children()[0].click();
    $("#wa_submit").on("click",resetGame);
  });

  window.onbeforeunload=function()
  {
    game.terminate();
    //return "The game will be uploaded to the server. Thank you for the support!";
  };
  

});
