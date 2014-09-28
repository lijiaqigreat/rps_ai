/** @jsx React.DOM */

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var TodoList = React.createClass({displayName: 'TodoList',
  getInitialState: function() {
    return {items: ['hello', 'world', 'click', 'me']};
  },
  handleAdd: function() {
    this.state.items[0]="asdf"+new Date();
    var newItems =
      this.state.items.slice(0);
    this.setState({items: newItems});
    console.log(this.state.items.length);
  },
  handleRemove: function(i) {
    var newItems = this.state.items;
    newItems.splice(i, 1).slice(0);
    this.setState({items: newItems});
  },
  render: function() {
    var items = this.state.items.map(function(item, i) {
      return (
        React.DOM.div({key: item, onClick: this.handleRemove.bind(this, i)}, 
          item
        )
      );
    }.bind(this));
    return (
      React.DOM.div(null, 
        React.DOM.button({onClick: this.handleAdd}, "Add Item"), 
        ReactCSSTransitionGroup({transitionName: "example"}, 
          items
        )
      )
    );
  }
});
React.renderComponent(new TodoList({}),document.getElementById("test"));
