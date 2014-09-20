function randInt(n){
  return (Math.random()*n)|0;
}
var consts={
  abbr:["r","p","s"]
};
var roundR=React.createClass({
  render: function (){
    return React.DOM.div(
      {class: "round"},
      React.DOM.img({src: "/asset/rps_"+consts.abbr[this.props.p1]+"1.jpg"}),
      React.DOM.img({src: "/asset/rps_"+consts.abbr[this.props.p2]+"2.jpg"})
    );
  }
});
var statR=React.createClass({
  render: function(){
    
  }
});

//test
React.renderComponent(roundR({p1:1,p2:0}), $("#test1")[0]);

