var rps=$.extend((rps||{}),function(){
  var roundR=React.createClass(
  {
    render: function (){
      return React.DOM.div(
        {className: "col-xs-6 col-md-4 col-lg-2 roundR"},
        React.DOM.div({className: "col-xs-4 roundRc",style:{"background-image":"url('asset/rps_"+rps.consts.abbr[this.props.h0]+"0.jpg')"}}),
        React.DOM.div({className: "col-xs-4"},rps.consts.result[(this.props.h1-this.props.h0+3)%3]),
        React.DOM.div({className: "col-xs-4 roundRc",style:{"background-image":"url('asset/rps_"+rps.consts.abbr[this.props.h1]+"1.jpg')"}})
        //React.DOM.img({src: "asset/rps_"+rps.consts.abbr[this.props.h1]+"1.jpg"})
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
  return {
    updateView:function()
    {
      var h01=this.history[this.history.length-1];
      var h0=h01%3;
      var h1=(h01/3)|0;
      //update result
      $(gr_0).css("background-image","url('asset/rps_"+this.consts.abbr[h0]+"0.jpg')");
      $(gr_1).css("background-image","url('asset/rps_"+this.consts.abbr[h1]+"1.jpg')");
      
      //update history
      React.renderComponent(new roundsR({list:this.history}),$("#g_hist")[0]);
      //update stat
      var count=[0,0,0];
      this.history.forEach(function(h01){
        var h0=h01%3;
        var h1=(h01/3)|0;
        count[(h1-h0+3)%3]++;
      });
      React.renderComponent(React.DOM.div({className:"col-xs-12"},"win: "+count[2]+",tie: "+count[0]+",lose: "+count[1]),$("#g_stat")[0]);
    }
  };
}());
