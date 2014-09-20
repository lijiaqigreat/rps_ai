

var HelloMessage = React.createClass({
  displayName: 'HelloMessage',
  render: function() {
    return React.DOM.div(null, React.DOM.img({src: "test"+this.props.a+".png"}),React.DOM.img({src: "test"+this.props.a+".png"}));
  }
});

React.renderComponent(HelloMessage({a: "John"}), $("#test1")[0]);

