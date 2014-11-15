var rps=$.extend((rps||{}),function(){
  var randomInt=function(n){
    return Math.random()*n | 0;
  };
  var roundR=React.createClass(
  {
    render: function (){
      return React.DOM.div(
        {className: "roundR"},
        React.DOM.div({className: "roundRc"},
          React.DOM.img({src:"asset/rps_"+rps.consts.abbr[this.props.h0]+"0.jpg"})
        ),
        React.DOM.div({className: "roundRc"},rps.consts.result[(this.props.h1-this.props.h0+3)%3]),
        React.DOM.div({className: "roundRc"},
          React.DOM.img({src:"asset/rps_"+rps.consts.abbr[this.props.h1]+"1.jpg"})
        )
      );
    }
  });
  var roundsR=React.createClass(
  {
    render: function (){
      var list=this.props.list.map(function(h01){
        return new roundR({h0:h01%3,h1:(h01/3)|0});
      }).reverse();
      return React.DOM.div({},list);
    }
  });
  var metaR=React.createClass(
  {
    render: function (){
      
    }
  });
  return {
    randomInt:randomInt,
    //data
    consts:
    {
      abbr:["r","p","s"],
      result:["TIE","LOSE","WIN"]
    },
    bot:undefined,
    //TODO what is this?
    meta:undefined,
    //update view
    history:[],
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
    }
  };
}());
//server: update rps.bot, rps.
var server={
  lastUpdate:$("#s_last").text(),
  param:JSON.parse($("#s_param").text()),
  data:""
};
