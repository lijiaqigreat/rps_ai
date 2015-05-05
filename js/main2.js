define(["./game.js","./player/bot.js","./consts.js"],
function(Game,Bot,consts){
  //define helper
  var getParam=function(i)
  {
    return {
      boturi:$("#source"+i).val(),
      dataurl:$("#data"+i).val(),
      botparam:$("#param"+i).val()
    };
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
  var param1,param2;
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
    //updateResult(h0,h1);

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
    //setBottext(win);
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
      //$("#g_bottext").text("Game ended. Happy to play with you again!");

    }

    //global=game;
  };
  var startGame=function()
  {
    $("#rh_tbody").html("");
    if(game!==undefined){
      updateResult(3,3);
      //setBottext(4);
      //$("#g_bottext").text("I'm ready to play!");
    }
    updateStat([0,0,0]);
    param1=getParam(0);
    param2=getParam(1);
    var hands=$("#g_hand > div").toArray();
    var p1=Bot(param1);
    var p2=Bot(param2);
    game=Game(p1,p2,0,game_start,nth,nth,game_end,Number($("#round").val()));
  };
  var resetGame=function()
  {
    if(game!==undefined){
      //STOP
      game.terminate();
    }
    startGame();
  };

  $("#run").on("click",function(){resetGame();return false;});
  
  

});
