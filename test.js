function randInt(n){
  return (Math.random()*n)|0;
}
var consts={
  abbr:["r","p","s"]
};
var roundR=React.createClass({
  getDefaultProps: function() {
    return {
      value: 'test_a'
    };
  },
  getInitialState: function() {
    return {p1:1,p2:0,test:this.props.value,cl:0};
  },
  render: function (){
    return React.DOM.div(
      {
        class: "round",
        onClick: function(){
          this.setState({cl:this.state.cl^1});
        }.bind(this)
      },
      React.DOM.img({src: "/asset/rps_"+consts.abbr[this.state.p1]+"1.jpg"}),
      React.DOM.img({src: "/asset/rps_"+consts.abbr[this.state.p2]+"2.jpg"}),
      React.DOM.div({className:"testdiv"+(this.state.cl?"":"1")})
    );
  }
});

var cheat;

//test
var roundr=new roundR({value:"a"});
var roundr=new roundR({value:"b"});
React.renderComponent(roundr, $("#test1")[0]);
//React.renderComponent(roundR({p1:0,p2:0,test:"b"}), $("#test1")[0]);

