define(["jquery","./game.js","./player/human.js","./player/bot.js","./consts.js","../vendor/md5.js"],
function($,Game,Human,Bot,consts,md5){
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
  var hands=$("#g_hand > div").toArray();
  var param={boturi:"https://api.github.com/repos/lijiaqigreat/rps_markov/contents/main.js",botparam:"",dataurl:" "};
  var p1=Human({doms:hands});
  var p2=Bot(param);
  var game;
  p2.then(function(){
  },function(error){
  });
  var start=function()
  {
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
      //change order for gui
      i=(i+2)%3;
      this.innerHTML=getPersent(i);
    });
  };
  var nth=function(){};
  var end=function()
  {
    console.log("end!!!");
    var hist=btoa(String.fromCharCode.apply(null,game.history));
    var name="test1";
    var hash=md5.digest_s(JSON.stringify(param));
    var ip="http://54.69.127.139";
    var data={hash:hash,name:name,hist:hist};
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
  };
  game=Game(p1,p2,0,start,nth,nth,end,100);

});
